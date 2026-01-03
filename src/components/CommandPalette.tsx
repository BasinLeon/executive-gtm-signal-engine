import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ArrowRight, Users, Briefcase, BookOpen, Zap, LayoutDashboard, GraduationCap, Video } from 'lucide-react';
import { AppView, Contact, JobDeal } from '../types';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    contacts: Contact[];
    pipeline: JobDeal[];
    onNavigate: (view: AppView) => void;
    onSelectContact: (id: string) => void;
    onSelectDeal: (id: string) => void;
}

interface CommandItem {
    id: string;
    type: 'navigation' | 'contact' | 'deal' | 'action';
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    isOpen,
    onClose,
    contacts,
    pipeline,
    onNavigate,
    onSelectContact,
    onSelectDeal
}) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Navigation items
    const navigationItems: CommandItem[] = [
        { id: 'nav-dashboard', type: 'navigation', title: 'Command Center', subtitle: 'Dashboard overview', icon: <LayoutDashboard className="w-4 h-4" />, action: () => { onNavigate(AppView.DASHBOARD); onClose(); } },
        { id: 'nav-network', type: 'navigation', title: 'Network Intelligence', subtitle: 'CRM & Contacts', icon: <Users className="w-4 h-4" />, action: () => { onNavigate(AppView.NETWORK); onClose(); } },
        { id: 'nav-pipeline', type: 'navigation', title: 'Revenue Ops', subtitle: 'Pipeline Tracker', icon: <Briefcase className="w-4 h-4" />, action: () => { onNavigate(AppView.PIPELINE); onClose(); } },
        { id: 'nav-knowledge', type: 'navigation', title: 'Neural Core', subtitle: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" />, action: () => { onNavigate(AppView.KNOWLEDGE); onClose(); } },
        { id: 'nav-agents', type: 'navigation', title: 'Nexus Agents', subtitle: 'AI Automation', icon: <Zap className="w-4 h-4" />, action: () => { onNavigate(AppView.AGENTS); onClose(); } },
        { id: 'nav-dojo', type: 'navigation', title: 'Tactical Dojo', subtitle: 'Practice & Simulation', icon: <GraduationCap className="w-4 h-4" />, action: () => { onNavigate(AppView.DOJO); onClose(); } },
        { id: 'nav-studio', type: 'navigation', title: 'Visionary Studio', subtitle: 'Content Generation', icon: <Video className="w-4 h-4" />, action: () => { onNavigate(AppView.MEDIA_OPS); onClose(); } },
    ];

    // Contact items
    const contactItems: CommandItem[] = contacts.slice(0, 20).map(c => ({
        id: `contact-${c.id}`,
        type: 'contact',
        title: c.name,
        subtitle: `${c.company} · ${c.role}`,
        icon: <Users className="w-4 h-4 text-cyan-400" />,
        action: () => { onSelectContact(c.id); onNavigate(AppView.NETWORK); onClose(); }
    }));

    // Deal items
    const dealItems: CommandItem[] = pipeline.slice(0, 15).map(d => ({
        id: `deal-${d.id}`,
        type: 'deal',
        title: `${d.company} - ${d.role}`,
        subtitle: `${d.stage} · ${d.probability}%`,
        icon: <Briefcase className="w-4 h-4 text-emerald-400" />,
        action: () => { onSelectDeal(d.id); onNavigate(AppView.PIPELINE); onClose(); }
    }));

    // Filter items based on query
    const filteredItems = useMemo(() => {
        const allItems = [...navigationItems, ...contactItems, ...dealItems];
        if (!query.trim()) {
            return navigationItems; // Show navigation by default
        }
        const lowerQuery = query.toLowerCase();
        return allItems.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.subtitle?.toLowerCase().includes(lowerQuery)
        ).slice(0, 10);
    }, [query, contacts, pipeline]);

    // Reset selection when items change
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredItems.length]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(i => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredItems[selectedIndex]) {
                        filteredItems[selectedIndex].action();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, filteredItems, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl mx-4 shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-700">
                    <Search className="w-5 h-5 text-slate-500" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search contacts, deals, or navigate..."
                        className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none text-lg"
                    />
                    <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-slate-800 rounded text-xs text-slate-500 border border-slate-700">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No results found</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {filteredItems.map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={item.action}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${index === selectedIndex
                                            ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/30'
                                            : 'hover:bg-slate-800'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-[#D4AF37]/20' : 'bg-slate-800'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="text-sm font-medium text-white">{item.title}</div>
                                        {item.subtitle && (
                                            <div className="text-xs text-slate-500">{item.subtitle}</div>
                                        )}
                                    </div>
                                    <ArrowRight className={`w-4 h-4 transition-opacity ${index === selectedIndex ? 'opacity-100 text-[#D4AF37]' : 'opacity-0'
                                        }`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-4">
                        <span>↑↓ Navigate</span>
                        <span>↵ Select</span>
                        <span>ESC Close</span>
                    </div>
                    <span className="text-[#D4AF37]">⌘K</span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
