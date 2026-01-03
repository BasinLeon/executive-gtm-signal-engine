import React, { useState, useEffect } from 'react';
import {
    Plus, X, Search, User, Briefcase, MessageSquare, Zap,
    Keyboard, Mail, Phone, Bot, FileText, Settings, Command
} from 'lucide-react';
import { AppView } from '../types.ts';

interface QuickActionsProps {
    setView: (view: AppView) => void;
    onOpenSearch: () => void;
    onOpenSettings: () => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

interface QuickAction {
    id: string;
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    action: () => void;
    color: string;
}

export const QuickActionsHub: React.FC<QuickActionsProps> = ({
    setView,
    onOpenSearch,
    onOpenSettings,
    addNotification
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);

    // Keyboard shortcuts handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if not in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.metaKey || e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'k':
                        e.preventDefault();
                        onOpenSearch();
                        break;
                    case 'n':
                        e.preventDefault();
                        setView(AppView.NETWORK);
                        addNotification('INFO', 'Navigated', 'Identity CRM');
                        break;
                    case 'p':
                        e.preventDefault();
                        setView(AppView.PIPELINE);
                        addNotification('INFO', 'Navigated', 'Revenue Pipeline');
                        break;
                    case 'd':
                        e.preventDefault();
                        setView(AppView.DASHBOARD);
                        addNotification('INFO', 'Navigated', 'War Room');
                        break;
                    case '/':
                    case '?':
                        e.preventDefault();
                        setShowKeyboardGuide(true);
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onOpenSearch, setView, addNotification]);

    const actions: QuickAction[] = [
        {
            id: 'search',
            icon: <Search size={18} />,
            label: 'Search',
            shortcut: '⌘K',
            action: onOpenSearch,
            color: 'bg-slate-700'
        },
        {
            id: 'add-contact',
            icon: <User size={18} />,
            label: 'Add Contact',
            shortcut: '⌘N',
            action: () => {
                setView(AppView.NETWORK);
                addNotification('INFO', 'Quick Action', 'Navigate to CRM to add contact');
            },
            color: 'bg-cyan-600'
        },
        {
            id: 'new-deal',
            icon: <Briefcase size={18} />,
            label: 'New Deal',
            shortcut: '⌘P',
            action: () => {
                setView(AppView.PIPELINE);
                addNotification('INFO', 'Quick Action', 'Navigate to Pipeline to add deal');
            },
            color: 'bg-emerald-600'
        },
        {
            id: 'agent-task',
            icon: <Bot size={18} />,
            label: 'Run Agent',
            action: () => {
                setView(AppView.AGENTS);
                addNotification('INFO', 'Quick Action', 'Opening Agent Hub');
            },
            color: 'bg-purple-600'
        },
        {
            id: 'dojo',
            icon: <Zap size={18} />,
            label: 'Practice',
            action: () => {
                setView(AppView.DOJO);
                addNotification('INFO', 'Quick Action', 'Entering Tactical Dojo');
            },
            color: 'bg-orange-600'
        },
        {
            id: 'keyboard',
            icon: <Keyboard size={18} />,
            label: 'Shortcuts',
            shortcut: '⌘?',
            action: () => setShowKeyboardGuide(true),
            color: 'bg-slate-600'
        },
    ];

    const keyboardShortcuts = [
        { keys: ['⌘', 'K'], description: 'Open search' },
        { keys: ['⌘', 'D'], description: 'Go to Dashboard' },
        { keys: ['⌘', 'N'], description: 'Go to Network CRM' },
        { keys: ['⌘', 'P'], description: 'Go to Pipeline' },
        { keys: ['⌘', '?'], description: 'Show keyboard shortcuts' },
        { keys: ['⌘', 'B'], description: 'Bold text (in editor)' },
        { keys: ['⌘', 'I'], description: 'Italic text (in editor)' },
        { keys: ['⌘', 'Z'], description: 'Undo' },
        { keys: ['Esc'], description: 'Close modal/menu' },
    ];

    return (
        <>
            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50 lg:hidden">
                <div className={`relative ${isOpen ? '' : ''}`}>
                    {/* Action buttons - shown when open */}
                    {isOpen && (
                        <div className="absolute bottom-16 right-0 space-y-2 animate-in slide-in-from-bottom-2 fade-in">
                            {actions.slice(0, 5).reverse().map((action, index) => (
                                <button
                                    key={action.id}
                                    onClick={() => { action.action(); setIsOpen(false); }}
                                    className={`flex items-center gap-3 px-4 py-3 ${action.color} text-white rounded-xl shadow-lg hover:scale-105 transition-transform min-w-[140px] animate-in slide-in-from-right fade-in`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {action.icon}
                                    <span className="text-xs font-bold uppercase">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Main FAB */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${isOpen
                                ? 'bg-red-500 rotate-45'
                                : 'bg-[#D4AF37] hover:bg-yellow-500 hover:scale-110'
                            }`}
                    >
                        {isOpen ? <X size={24} className="text-white" /> : <Plus size={24} className="text-black" />}
                    </button>
                </div>
            </div>

            {/* Desktop Quick Actions Bar */}
            <div className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-2 gap-1 shadow-2xl">
                {actions.map(action => (
                    <button
                        key={action.id}
                        onClick={action.action}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative"
                        title={action.label}
                    >
                        {action.icon}
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden xl:inline">{action.label}</span>
                        {action.shortcut && (
                            <span className="text-[8px] font-mono text-slate-600 group-hover:text-slate-400 hidden xl:inline">
                                {action.shortcut}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Keyboard Shortcuts Modal */}
            {showKeyboardGuide && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in"
                    onClick={() => setShowKeyboardGuide(false)}
                >
                    <div
                        className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                                <Command size={18} className="text-[#D4AF37]" /> Keyboard Shortcuts
                            </h3>
                            <button
                                onClick={() => setShowKeyboardGuide(false)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {keyboardShortcuts.map((shortcut, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl"
                                >
                                    <span className="text-sm text-slate-300">{shortcut.description}</span>
                                    <div className="flex gap-1">
                                        {shortcut.keys.map((key, j) => (
                                            <span
                                                key={j}
                                                className="px-2 py-1 bg-slate-700 text-white text-xs font-mono rounded border border-slate-600"
                                            >
                                                {key}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center text-[10px] text-slate-600">
                            Press <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded">Esc</span> to close
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickActionsHub;
