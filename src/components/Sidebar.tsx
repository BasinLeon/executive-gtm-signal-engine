import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Swords, Users, Briefcase, Database, ChevronRight, Aperture, Search, Download, Save, ShieldCheck, Hexagon, Bot, Settings } from 'lucide-react';
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

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userState, onQuantumSelect, onExportData, onImportData, onOpenSettings }) => {
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

    const navItem = (view: AppView, icon: React.ReactNode, label: string) => {
        const isActive = currentView === view;
        return (
            <button
                onClick={() => setView(view)}
                className={`flex items-center space-x-4 w-full p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                    ? 'bg-[#D4AF37]/10 text-white'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
            >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]"></div>}
                <div className={`${isActive ? 'text-[#D4AF37]' : 'text-slate-600 group-hover:text-slate-300'}`}>
                    {icon}
                </div>
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase">{label}</span>
            </button>
        );
    };

    return (
        <div className="w-80 h-screen flex flex-col border-r border-slate-800/40 relative z-50 bg-[#020617]/80 backdrop-blur-3xl shadow-[5px_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-cyan-900/10 pointer-events-none"></div>

            <div className="p-8 border-b border-white/5 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-transparent opacity-50"></div>
                <h1 className="text-2xl font-black font-mono tracking-tighter text-white flex items-center gap-3 relative z-10 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <Hexagon size={24} className="text-[#D4AF37]" strokeWidth={2.5} /> BASIN <span className="text-[#D4AF37]">:: NEXUS</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-mono mt-2 tracking-[0.4em] uppercase font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
                    Sovereign War Room v9.0
                </p>
            </div>

            <div className="px-6 py-6 relative z-10">
                <div className="relative group">
                    <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" size={14} />
                    <input
                        id="cmd-k-search"
                        type="text"
                        placeholder="CMD+K TO SEARCH..."
                        className="w-full bg-black/40 border border-slate-800/60 rounded-xl py-3 pl-11 pr-4 text-[10px] text-slate-200 font-mono focus:outline-none focus:border-[#D4AF37] focus:bg-black/60 transition-all placeholder:text-slate-700 focus:shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-3 top-3.5 flex gap-1">
                        <span className="text-[9px] font-black text-slate-700 border border-slate-800 rounded px-1.5 py-0.5">⌘</span>
                        <span className="text-[9px] font-black text-slate-700 border border-slate-800 rounded px-1.5 py-0.5">K</span>
                    </div>
                </div>

                {searchTerm && (
                    <div className="absolute left-6 right-6 top-16 bg-[#0B0F1C] border border-slate-700 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden border-t-2 border-t-[#D4AF37] animate-in slide-in-from-top-2 fade-in">
                        {searchResults.map((res) => (
                            <button
                                key={res.id}
                                onClick={() => { onQuantumSelect(res); setSearchTerm(''); }}
                                className="w-full text-left p-4 hover:bg-slate-800/80 border-b border-white/5 last:border-0 flex items-center justify-between group transition-colors"
                            >
                                <div className="overflow-hidden">
                                    <div className="text-[10px] font-bold text-slate-300 group-hover:text-[#D4AF37] flex items-center gap-2 uppercase tracking-wider transition-colors">
                                        {res.icon} <span className="truncate">{res.label}</span>
                                    </div>
                                    <div className="text-[9px] text-slate-600 ml-5 truncate uppercase font-mono group-hover:text-slate-500">{res.sub}</div>
                                </div>
                                <ChevronRight size={12} className="text-[#D4AF37] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar relative z-10">
                <div className="mt-2 mb-4 text-[9px] font-mono text-slate-600 uppercase font-black tracking-[0.3em] px-2 border-l-2 border-[#D4AF37]/20 pl-4">Operational Grid</div>
                {navItem(AppView.DASHBOARD, <LayoutDashboard size={18} />, 'Command Center')}
                {navItem(AppView.DOJO, <Swords size={18} />, 'Tactical Dojo')}
                {navItem(AppView.KNOWLEDGE, <Database size={18} />, 'Neural Core (L22)')}
                {navItem(AppView.MEDIA_OPS, <Aperture size={18} />, 'Visionary Studio')}

                <div className="mt-8 mb-4 text-[9px] font-mono text-slate-600 uppercase font-black tracking-[0.3em] px-2 border-l-2 border-cyan-500/20 pl-4">Growth Engine</div>
                {navItem(AppView.NETWORK, <Users size={18} />, 'Identity CRM')}
                {navItem(AppView.PIPELINE, <Briefcase size={18} />, 'Revenue Ops')}
                {navItem(AppView.AGENTS, <Bot size={18} />, 'Nexus Agents')}
            </nav>

            <div className="mt-auto border-t border-white/5 bg-black/20 p-6 flex flex-col relative z-10 backdrop-blur-md">
                <div className="mb-6 flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all -mx-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 font-bold text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all">LB</div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">Leon Basin</div>
                        <div className="text-[8px] font-mono uppercase text-[#00E5FF] font-bold tracking-widest">LVL {userState?.level} SOVEREIGN</div>
                    </div>
                </div>

                <div className="mb-4 space-y-3">
                    <button onClick={() => setShowSettings(!showSettings)} className="flex w-full items-center justify-between text-[9px] font-bold font-mono uppercase tracking-widest text-slate-500 transition-colors hover:text-white group">
                        <span className="flex items-center gap-2 group-hover:text-[#D4AF37] transition-colors"><Save size={12} /> System Link</span>
                        <ChevronRight size={12} className={`transform transition-transform ${showSettings ? 'rotate-90' : ''}`} />
                    </button>

                    {onOpenSettings && (
                        <button onClick={onOpenSettings} className="flex w-full items-center gap-2 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-3 text-[9px] font-black uppercase tracking-widest text-[#D4AF37]/70 transition-all hover:bg-[#D4AF37]/20 hover:text-[#D4AF37]">
                            <Settings size={12} /> SYSTEM_SETTINGS
                        </button>
                    )}

                    <div className="flex items-center gap-3 px-1 py-1 bg-emerald-950/20 rounded border border-emerald-500/10">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-emerald-500 shadow-emerald-500/20">Node Hardened // TLS 1.3</span>
                    </div>
                </div>


                {showSettings && (
                    <div className="space-y-2 animate-in slide-in-from-bottom-2 fade-in mb-2">
                        <button onClick={onExportData} className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-[#D4AF37] hover:text-black">
                            <Download size={12} /> BACKUP_CORE
                        </button>
                        <div className="relative">
                            <input type="file" onChange={onImportData} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <button className="flex w-full items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 text-[9px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-cyan-600 hover:text-white pointer-events-none">
                                <ShieldCheck size={12} /> DATA_VAULT_IMPORT
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
