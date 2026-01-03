import React, { useState, useRef, useCallback } from 'react';
import {
    Bold, Italic, Underline, List, ListOrdered, Link2, Quote,
    Heading1, Heading2, Code, Sparkles, Copy, Check, Undo, Redo,
    AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onSynthesize?: () => void;
    isSynthesizing?: boolean;
}

interface ToolbarButton {
    icon: React.ReactNode;
    action: string;
    tooltip: string;
    shortcut?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder = 'Start typing...',
    onSynthesize,
    isSynthesizing
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [copied, setCopied] = useState(false);
    const [undoStack, setUndoStack] = useState<string[]>([]);
    const [redoStack, setRedoStack] = useState<string[]>([]);

    const insertFormatting = useCallback((prefix: string, suffix: string = '', placeholder?: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const textToInsert = selectedText || placeholder || '';

        const newValue = value.substring(0, start) + prefix + textToInsert + suffix + value.substring(end);

        // Save to undo stack
        setUndoStack(prev => [...prev, value]);
        setRedoStack([]);

        onChange(newValue);

        // Set cursor position after formatting
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length + textToInsert.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }, [value, onChange]);

    const insertAtLineStart = useCallback((prefix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;

        const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);

        setUndoStack(prev => [...prev, value]);
        setRedoStack([]);

        onChange(newValue);
    }, [value, onChange]);

    const handleUndo = useCallback(() => {
        if (undoStack.length === 0) return;
        const previousValue = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));
        setRedoStack(prev => [...prev, value]);
        onChange(previousValue);
    }, [undoStack, value, onChange]);

    const handleRedo = useCallback(() => {
        if (redoStack.length === 0) return;
        const nextValue = redoStack[redoStack.length - 1];
        setRedoStack(prev => prev.slice(0, -1));
        setUndoStack(prev => [...prev, value]);
        onChange(nextValue);
    }, [redoStack, value, onChange]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [value]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Keyboard shortcuts
        if (e.metaKey || e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    insertFormatting('**', '**', 'bold');
                    break;
                case 'i':
                    e.preventDefault();
                    insertFormatting('*', '*', 'italic');
                    break;
                case 'u':
                    e.preventDefault();
                    insertFormatting('__', '__', 'underline');
                    break;
                case 'k':
                    e.preventDefault();
                    insertFormatting('[', '](url)', 'link text');
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        handleRedo();
                    } else {
                        handleUndo();
                    }
                    break;
            }
        }
    }, [insertFormatting, handleUndo, handleRedo]);

    const toolbarButtons: ToolbarButton[][] = [
        [
            { icon: <Bold size={14} />, action: 'bold', tooltip: 'Bold (⌘B)', shortcut: '⌘B' },
            { icon: <Italic size={14} />, action: 'italic', tooltip: 'Italic (⌘I)' },
            { icon: <Underline size={14} />, action: 'underline', tooltip: 'Underline (⌘U)' },
        ],
        [
            { icon: <Heading1 size={14} />, action: 'h1', tooltip: 'Heading 1' },
            { icon: <Heading2 size={14} />, action: 'h2', tooltip: 'Heading 2' },
        ],
        [
            { icon: <List size={14} />, action: 'ul', tooltip: 'Bullet List' },
            { icon: <ListOrdered size={14} />, action: 'ol', tooltip: 'Numbered List' },
            { icon: <Quote size={14} />, action: 'quote', tooltip: 'Quote' },
        ],
        [
            { icon: <Link2 size={14} />, action: 'link', tooltip: 'Link (⌘K)' },
            { icon: <Code size={14} />, action: 'code', tooltip: 'Code' },
        ],
    ];

    const handleToolbarClick = (action: string) => {
        switch (action) {
            case 'bold':
                insertFormatting('**', '**', 'bold text');
                break;
            case 'italic':
                insertFormatting('*', '*', 'italic text');
                break;
            case 'underline':
                insertFormatting('__', '__', 'underlined text');
                break;
            case 'h1':
                insertAtLineStart('# ');
                break;
            case 'h2':
                insertAtLineStart('## ');
                break;
            case 'ul':
                insertAtLineStart('• ');
                break;
            case 'ol':
                insertAtLineStart('1. ');
                break;
            case 'quote':
                insertAtLineStart('> ');
                break;
            case 'link':
                insertFormatting('[', '](url)', 'link text');
                break;
            case 'code':
                insertFormatting('`', '`', 'code');
                break;
        }
    };

    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    const charCount = value.length;

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-2 p-3 bg-slate-900/50 border-b border-slate-800 rounded-t-2xl">
                <div className="flex items-center gap-1">
                    {toolbarButtons.map((group, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                            <div className="flex items-center gap-0.5">
                                {group.map((btn) => (
                                    <button
                                        key={btn.action}
                                        onClick={() => handleToolbarClick(btn.action)}
                                        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                                        title={btn.tooltip}
                                    >
                                        {btn.icon}
                                    </button>
                                ))}
                            </div>
                            {groupIndex < toolbarButtons.length - 1 && (
                                <div className="w-px h-5 bg-slate-700 mx-1" />
                            )}
                        </React.Fragment>
                    ))}

                    <div className="w-px h-5 bg-slate-700 mx-2" />

                    {/* Undo/Redo */}
                    <button
                        onClick={handleUndo}
                        disabled={undoStack.length === 0}
                        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Undo (⌘Z)"
                    >
                        <Undo size={14} />
                    </button>
                    <button
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Redo (⌘⇧Z)"
                    >
                        <Redo size={14} />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Copy button */}
                    <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Copy all"
                    >
                        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>

                    {/* Synthesize button */}
                    {onSynthesize && (
                        <button
                            onClick={onSynthesize}
                            disabled={isSynthesizing}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${isSynthesizing
                                    ? 'bg-slate-800 text-slate-600'
                                    : 'bg-[#D4AF37] text-black hover:bg-yellow-500'
                                }`}
                        >
                            <Sparkles size={12} className={isSynthesizing ? 'animate-spin' : ''} />
                            {isSynthesizing ? 'Synthesizing...' : 'Synthesize'}
                        </button>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full h-full bg-transparent text-slate-300 font-mono text-lg leading-relaxed p-6 focus:outline-none resize-none placeholder:text-slate-800 selection:bg-[#D4AF37]/30"
                />
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/30 border-t border-slate-800 rounded-b-2xl">
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                    <span>{wordCount} words</span>
                    <span>{charCount} chars</span>
                </div>
                <div className="text-[10px] font-mono text-slate-700">
                    Markdown supported
                </div>
            </div>
        </div>
    );
};

export default RichTextEditor;
