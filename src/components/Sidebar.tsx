import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard, Swords, Users, Briefcase, Database, ChevronRight, Aperture,
    Search, Download, Save, ShieldCheck, Hexagon, Bot, Settings, Zap, Target,
    Network, Brain, Rocket, Sparkles, Activity, Crown
} from 'lucide-react';
import { AppView, UserState } from '../types.ts';

interface SidebarProps {
    currentView: AppView;
    setView: (view: AppView) => void;
    userState?: UserState;
    onQuantumSelect: (result: { id: string; type: 'CONTACT' | 'DEAL' | 'ASSET' | 'PAGE'; view: AppView }) => void;
    onExportData: () => void;
    onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenSettings?: () => void;
}

// Navigation categories with premium styling
const navCategories = [
    {
        id: 'command',
        label: 'Command Center',
        icon: <Crown size={10} />,
        color: 'border-[#D4AF37]/30',
        textColor: 'text-[#D4AF37]',
        items: [
            { view: AppView.DASHBOARD, icon: <LayoutDashboard size={18} />, label: 'War Room', sublabel: 'Command HQ', badge: 'LIVE' },
            { view: AppView.DOJO, icon: <Swords size={18} />, label: 'Tactical Dojo', sublabel: 'Interview Prep' },
            { view: AppView.KNOWLEDGE, icon: <Brain size={18} />, label: 'Neural Core', sublabel: 'L22 Identity' },
            { view: AppView.MEDIA_OPS, icon: <Aperture size={18} />, label: 'Visionary Studio', sublabel: 'Asset Forge' },
        ]
    },
    {
        id: 'growth',
        label: 'Growth Engine',
        icon: <Rocket size={10} />,
        color: 'border-cyan-500/30',
        textColor: 'text-cyan-400',
        items: [
            { view: AppView.NETWORK, icon: <Users size={18} />, label: 'Identity CRM', sublabel: 'Network Graph' },
            { view: AppView.PIPELINE, icon: <Briefcase size={18} />, label: 'Revenue Pipeline', sublabel: 'Deal Flow' },
            { view: AppView.AGENTS, icon: <Bot size={18} />, label: 'Nexus Agents', sublabel: 'AI Workforce', badge: 'PRO' },
        ]
    }
];

export const Sidebar: React.FC<SidebarProps> = ({
    currentView, setView, userState, onQuantumSelect, onExportData, onImportData, onOpenSettings
}) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('cmd-k-search')?.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    const searchResults = useMemo(() => {
        if (!searchTerm || !userState) return [];
        const term = searchTerm.toLowerCase();
        const results: any[] = [];
        userState.contacts.forEach(c => {
            if (c.name.toLowerCase().includes(term) || c.company.toLowerCase().includes(term)) {
                results.push({ id: c.id, label: c.name, sub: c.company, type: 'CONTACT', view: AppView.NETWORK, icon: <Users size={12} /> });
            }
        });
        userState.pipeline.forEach(d => {
            if (d.company.toLowerCase().includes(term) || d.role.toLowerCase().includes(term)) {
                results.push({ id: d.id, label: d.company, sub: d.role, type: 'DEAL', view: AppView.PIPELINE, icon: <Briefcase size={12} /> });
            }
        });
        return results.slice(0, 8);
    }, [searchTerm, userState]);

    // Calculate user level from XP
    const userLevel = useMemo(() => {
        const xp = userState?.xp || 0;
        if (xp >= 12000) return { level: 7, title: 'Sovereign', color: 'text-[#D4AF37]' };
        if (xp >= 8000) return { level: 6, title: 'Commander', color: 'text-red-400' };
        if (xp >= 5000) return { level: 5, title: 'Architect', color: 'text-orange-400' };
        if (xp >= 3000) return { level: 4, title: 'Strategist', color: 'text-purple-400' };
        if (xp >= 1500) return { level: 3, title: 'Operator', color: 'text-blue-400' };
        if (xp >= 500) return { level: 2, title: 'Apprentice', color: 'text-cyan-400' };
        return { level: 1, title: 'Initiate', color: 'text-slate-400' };
    }, [userState?.xp]);

    const navItem = (view: AppView, icon: React.ReactNode, label: string, sublabel?: string, badge?: string) => {
        const isActive = currentView === view;
        return (
            <button
                onClick={() => setView(view)}
                className={`flex items-center w-full p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                        ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent text-white'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
            >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]" />}
                <div className={`ml-1 ${isActive ? 'text-[#D4AF37]' : 'text-slate-600 group-hover:text-slate-300'}`}>
                    {icon}
                </div>
                <div className="ml-3 flex-1 text-left">
                    <span className="font-mono text-[10px] font-bold tracking-wider uppercase block">{label}</span>
                    {sublabel && (
                        <span className="font-mono text-[8px] text-slate-600 uppercase tracking-wider">{sublabel}</span>
                    )}
                </div>
                {badge && (
                    <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${badge === 'LIVE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            badge === 'PRO' ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30' :
                                'bg-slate-800 text-slate-500'
                        }`}>
                        {badge}
                    </span>
                )}
            </button>
        );
    };

    return (
        <div className="w-72 lg:w-80 h-screen flex flex-col border-r border-slate-800/40 relative z-50 bg-[#020617]/95 backdrop-blur-3xl shadow-[5px_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-cyan-900/10 pointer-events-none" />

            {/* Logo */}
            <div className="p-6 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-transparent opacity-50" />
                <h1 className="text-xl font-black font-mono tracking-tighter text-white flex items-center gap-2 relative z-10">
                    <Hexagon size={20} className="text-[#D4AF37]" strokeWidth={2.5} />
                    BASIN<span className="text-[#D4AF37]">::NEXUS</span>
                </h1>
                <p className="text-[9px] text-slate-500 font-mono mt-1 tracking-[0.3em] uppercase font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
                    Sovereign Edition v9.0
                </p>
            </div>

            {/* Search */}
            <div className="px-4 py-4 relative z-10">
                <div className="relative group">
                    <Search className="absolute left-3 top-3 text-slate-600 group-focus-within:text-[#D4AF37] transition-colors" size={12} />
                    <input
                        id="cmd-k-search"
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-black/40 border border-slate-800/60 rounded-xl py-2.5 pl-9 pr-16 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-[#D4AF37] focus:bg-black/60 transition-all placeholder:text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-2 top-2 flex gap-0.5">
                        <span className="text-[8px] font-black text-slate-700 border border-slate-800 rounded px-1 py-0.5">⌘</span>
                        <span className="text-[8px] font-black text-slate-700 border border-slate-800 rounded px-1 py-0.5">K</span>
                    </div>
                </div>

                {/* Search Results */}
                {searchTerm && searchResults.length > 0 && (
                    <div className="absolute left-4 right-4 top-14 bg-[#0B0F1C] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden border-t-2 border-t-[#D4AF37] animate-in slide-in-from-top-2">
                        {searchResults.map((res) => (
                            <button
                                key={res.id}
                                onClick={() => { onQuantumSelect(res); setSearchTerm(''); }}
                                className="w-full text-left p-3 hover:bg-slate-800/80 border-b border-white/5 last:border-0 flex items-center justify-between group transition-colors"
                            >
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 group-hover:text-[#D4AF37] uppercase tracking-wider">
                                    {res.icon} <span className="truncate">{res.label}</span>
                                </div>
                                <ChevronRight size={10} className="text-[#D4AF37] opacity-0 group-hover:opacity-100" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar relative z-10 space-y-4">
                {navCategories.map(category => (
                    <div key={category.id}>
                        <div className={`text-[8px] font-mono uppercase font-black tracking-[0.25em] px-2 py-2 border-l-2 ${category.color} pl-3 flex items-center gap-2 ${category.textColor}`}>
                            {category.icon} {category.label}
                        </div>
                        <div className="space-y-1 mt-2">
                            {category.items.map(item => navItem(item.view, item.icon, item.label, item.sublabel, item.badge))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Panel */}
            <div className="mt-auto border-t border-white/5 bg-black/20 p-4 flex flex-col relative z-10 backdrop-blur-md">
                {/* User Info */}
                <div className="mb-4 flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all -mx-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 font-bold text-[#D4AF37] text-sm shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                        LB
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">Leon Basin</div>
                        <div className={`text-[8px] font-mono uppercase font-bold tracking-widest ${userLevel.color}`}>
                            LVL {userLevel.level} {userLevel.title}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-mono font-bold text-[#D4AF37]">{(userState?.xp || 0).toLocaleString()}</div>
                        <div className="text-[7px] text-slate-600 uppercase">XP</div>
                    </div>
                </div>

                {/* Settings Button */}
                {onOpenSettings && (
                    <button
                        onClick={onOpenSettings}
                        className="flex w-full items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-2.5 text-[9px] font-black uppercase tracking-widest text-[#D4AF37]/70 transition-all hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] mb-3"
                    >
                        <Settings size={12} /> System Settings
                    </button>
                )}

                {/* System Status */}
                <div className="flex items-center gap-2 px-2 py-1.5 bg-emerald-950/20 rounded-lg border border-emerald-500/10">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </div>
                    <span className="text-[7px] font-mono font-black uppercase tracking-widest text-emerald-500">
                        System Hardened • TLS 1.3
                    </span>
                </div>
            </div>
        </div>
    );
};
