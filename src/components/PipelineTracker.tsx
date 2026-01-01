
import React, { useState, useEffect } from 'react';
import { UserState, JobStage, JobDeal, AppView, Contact } from '../types.ts';
import {
    X, Zap, Hexagon, Plus, DollarSign, Edit3, Trash2, FileText, Sparkles, RefreshCw, TrendingUp
} from 'lucide-react';
import { generateSovereignBriefing } from '../services/geminiService.ts';

interface PipelineTrackerProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    onPrepJob?: (job: JobDeal) => void;
    onBulkImport?: (data: { contacts: Partial<Contact>[], deals: Partial<JobDeal>[] }) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
    focusedDealId?: string;
    onNavigateTo?: (view: AppView, id?: string) => void;
}

interface ColumnProps {
    stage: JobStage;
    title: string;
    pipeline: JobDeal[];
    selectedDealId?: string;
    onSelectDeal: (deal: JobDeal) => void;
    onGenerateBrief: (deal: JobDeal) => void;
    onEdit: (deal: JobDeal) => void;
    onDragStart: (e: React.DragEvent, deal: JobDeal) => void;
    onDrop: (e: React.DragEvent, stage: JobStage) => void;
}

const KanbanColumn: React.FC<ColumnProps> = ({
    stage,
    title,
    pipeline,
    selectedDealId,
    onSelectDeal,
    onGenerateBrief,
    onEdit,
    onDragStart,
    onDrop
}) => {
    const deals = pipeline.filter(d => d.stage === stage);
    const total = deals.reduce((acc, d) => acc + (d.value || 0), 0);
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = () => setIsOver(false);

    const handleDrop = (e: React.DragEvent) => {
        setIsOver(false);
        onDrop(e, stage);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[340px] rounded-[3rem] border flex flex-col h-full overflow-hidden transition-colors duration-300 ${isOver ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-slate-900/10 border-slate-800/50'}`}
        >
            <div className={`p-8 border-b ${isOver ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'border-slate-800 bg-slate-900/40'} rounded-t-[3rem] backdrop-blur-xl sticky top-0 z-10 transition-colors`}>
                <div className="flex justify-between items-center mb-3">
                    <span className={`font-black text-[11px] uppercase tracking-[0.4em] ${isOver ? 'text-[#D4AF37]' : 'text-slate-500'}`}>{title}</span>
                    <span className="text-[10px] bg-slate-800 text-[#D4AF37] px-4 py-1.5 rounded-full border border-[#D4AF37]/20 font-mono font-bold">{deals.length} NODES</span>
                </div>
                <div className="text-3xl font-black text-white font-mono tracking-tighter">
                    {total >= 1000000 ? `$${(total / 1000000).toFixed(1)}M` : `$${(total / 1000).toFixed(0)}K`}
                    <span className="text-[10px] text-slate-700 tracking-widest ml-2">GROSS</span>
                </div>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                {deals.map(deal => (
                    <div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, deal)}
                        onClick={() => onSelectDeal(deal)}
                        className={`p-7 rounded-[2.5rem] border cursor-pointer hover:translate-y-[-6px] transition-all relative group bg-slate-900/40 hover:bg-slate-800/60 active:cursor-grabbing ${selectedDealId === deal.id ? 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)]' : 'border-slate-800/40'}`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="font-black text-slate-100 text-[15px] tracking-tighter uppercase leading-none">{deal.company}</div>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); onGenerateBrief(deal); }} className="p-2 bg-slate-950 rounded-lg text-slate-500 hover:text-[#00E5FF] transition-colors"><FileText size={14} /></button>
                                <button onClick={(e) => { e.stopPropagation(); onEdit(deal); }} className="p-2 bg-slate-950 rounded-lg text-slate-500 hover:text-[#D4AF37] transition-colors"><Edit3 size={14} /></button>
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono uppercase truncate mb-6 tracking-widest font-bold">{deal.role}</div>
                        <div className="flex justify-between items-center border-t border-slate-800/30 pt-4">
                            <div className="text-sm font-black text-[#D4AF37] font-mono">
                                {deal.value >= 1000000 ? `$${(deal.value / 1000000).toFixed(1)}M` : `$${(deal.value / 1000).toFixed(0)}K`}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-8 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#00E5FF]" style={{ width: `${deal.probability}%` }}></div>
                                </div>
                                <div className="text-[9px] text-[#00E5FF] font-black uppercase font-mono">{deal.probability}%</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
    userState,
    updateUserState,
    addNotification,
    focusedDealId
}) => {
    const [selectedDeal, setSelectedDeal] = useState<JobDeal | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editDeal, setEditDeal] = useState<Partial<JobDeal>>({});
    const [showBriefingModal, setShowBriefingModal] = useState(false);
    const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
    const [briefingContent, setBriefingContent] = useState('');

    useEffect(() => {
        if (focusedDealId) {
            const deal = (userState.pipeline || []).find(d => d.id === focusedDealId);
            if (deal) setSelectedDeal(deal);
        }
    }, [focusedDealId, userState.pipeline]);

    const handleDragStart = (e: React.DragEvent, deal: JobDeal) => {
        e.dataTransfer.setData('dealId', deal.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e: React.DragEvent, newStage: JobStage) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData('dealId');
        const deal = userState.pipeline.find(d => d.id === dealId);

        if (deal && deal.stage !== newStage) {
            const updatedPipeline = userState.pipeline.map(d =>
                d.id === dealId ? { ...d, stage: newStage } : d
            );
            updateUserState({ pipeline: updatedPipeline });
            addNotification('INFO', 'Stage Advanced', `Moved ${deal.company} to ${newStage}`);

            // Dopamine hit: If moved to CLOSED, huge success
            if (newStage === JobStage.CLOSED) {
                setTimeout(() => addNotification('SUCCESS', 'REVENUE CAPTURED', `${deal.company} closed. Sovereign Wealth Increased.`), 500);
            }
        }
    };

    const handleGenerateBriefing = async (deal: JobDeal) => {
        setIsGeneratingBrief(true);
        setShowBriefingModal(true);
        addNotification('INFO', 'Briefing Engine Engaged', 'Synthesizing identity shards for narrative generation.');
        try {
            const brief = await generateSovereignBriefing(userState.neuralCore, deal);
            setBriefingContent(brief);
            addNotification('SUCCESS', 'Narrative Synthesized', 'Sovereign Executive Briefing is ready.');
        } catch (e) {
            addNotification('ERROR', 'Synthesis Interrupt', 'Failed to generate briefing.');
        } finally {
            setIsGeneratingBrief(false);
        }
    };

    const handleInitializeOpportunity = () => {
        if (!editDeal.company || !editDeal.role) {
            addNotification('ERROR', 'Validation Failed', 'Company and Role are mandatory.');
            return;
        }
        const deal: JobDeal = {
            id: `deal-${Date.now()}`,
            company: editDeal.company!,
            role: editDeal.role!,
            salary: editDeal.salary || 'TBD',
            value: editDeal.value || 0,
            probability: editDeal.probability || 10,
            stage: editDeal.stage || JobStage.TARGET,
            intent: editDeal.intent || 'LOW',
            triggers: [],
            lastEnriched: new Date().toISOString(),
            securityProtocol: (editDeal.securityProtocol as any) || 'SOC2'
        };
        updateUserState({ pipeline: [...(userState.pipeline || []), deal], xp: userState.xp + 50 });
        addNotification('SUCCESS', 'Opportunity Synchronized', `Revenue corridor established for ${deal.company}`);
        setShowAddModal(false);
        setEditDeal({});
    };

    const handleUpdateDeal = () => {
        if (!selectedDeal) return;
        const updatedPipeline = (userState.pipeline || []).map(d =>
            d.id === selectedDeal.id ? { ...d, ...editDeal } : d
        );
        updateUserState({ pipeline: updatedPipeline });
        addNotification('SUCCESS', 'Matrix Updated', `${selectedDeal.company} recalibrated.`);
        setIsEditing(false);
        setSelectedDeal({ ...selectedDeal, ...editDeal } as JobDeal);
    };

    const startEdit = (deal: JobDeal) => {
        setEditDeal(deal);
        setIsEditing(true);
    };

    const deleteDeal = (id: string) => {
        if (confirm("Purge this revenue node from the corridor? This will remove all associated telemetry.")) {
            updateUserState({ pipeline: (userState.pipeline || []).filter(d => d.id !== id) });
            setSelectedDeal(null);
            setIsEditing(false);
            addNotification('WARNING', 'Node Purged', 'Revenue corridor closed.');
        }
    };

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700 overflow-hidden">
            <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full"></div>

            <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-10 relative z-10">
                <div>
                    <h2 className="text-6xl font-black text-white tracking-tighter flex items-center gap-6 uppercase leading-none">
                        <Hexagon className="text-[#D4AF37] animate-spin-slow" /> Revenue <span className="text-[#D4AF37]">Ops</span>
                    </h2>
                    <p className="text-[11px] text-slate-500 font-mono uppercase mt-3 tracking-[0.5em] font-black italic">v9.0 Sovereign Forecasting // Secure Corridor Link Active</p>
                </div>
                <div className="flex gap-6 items-center">
                    <div className="text-right mr-6 border-r border-slate-800 pr-8 hidden xl:block">
                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Pipeline Velocity</div>
                        <div className="text-2xl font-mono font-bold text-white tracking-tighter flex items-center gap-3 justify-end">
                            <TrendingUp size={18} className="text-emerald-500" /> +12.5%
                        </div>
                    </div>
                    <button onClick={() => { setEditDeal({}); setShowAddModal(true); }} className="bg-[#D4AF37] hover:bg-yellow-500 text-black px-12 py-5 rounded-[2rem] font-black text-[12px] tracking-[0.3em] uppercase transition-all shadow-[0_0_50px_rgba(212,175,55,0.3)] flex items-center gap-4">
                        <Plus size={22} strokeWidth={3} /> New Opportunity
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-8 overflow-x-auto pb-6 custom-scrollbar relative z-10">
                {Object.values(JobStage).map(stage => (
                    <KanbanColumn
                        key={stage}
                        stage={stage}
                        title={stage.toUpperCase()}
                        pipeline={userState.pipeline || []}
                        selectedDealId={selectedDeal?.id}
                        onSelectDeal={setSelectedDeal}
                        onGenerateBrief={handleGenerateBriefing}
                        onEdit={startEdit}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                    />
                ))}
            </div>

            {showBriefingModal && (
                <div className="fixed inset-0 bg-[#020617]/98 z-[200] flex items-center justify-center p-12 backdrop-blur-3xl animate-in zoom-in duration-500">
                    <div className="w-full max-w-5xl glass-panel p-16 rounded-[4rem] border border-[#00E5FF]/40 shadow-2xl relative flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <div className="flex items-center gap-8">
                                <div className="p-6 bg-[#00E5FF]/20 rounded-[2rem] text-[#00E5FF] border border-[#00E5FF]/20">
                                    <Sparkles size={32} className="animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Sovereign <span className="text-[#00E5FF]">Briefing</span></h3>
                                    <p className="text-[12px] text-slate-500 font-mono uppercase tracking-[0.4em] mt-3 font-bold">Executive Narrative // L22 Identity Shard Synthesis</p>
                                </div>
                            </div>
                            <button onClick={() => setShowBriefingModal(false)} className="text-slate-600 hover:text-white transition-all bg-slate-900/50 p-4 rounded-full"><X size={32} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950/80 p-12 rounded-[3rem] border border-slate-800 shadow-inner relative z-10">
                            {isGeneratingBrief ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <RefreshCw size={84} className="text-[#00E5FF] animate-spin-slow opacity-20 mb-10" />
                                    <p className="font-mono text-sm text-[#00E5FF] uppercase tracking-[0.6em] font-black">Deep Identity Synthesis in progress...</p>
                                </div>
                            ) : (
                                <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:font-mono prose-p:text-sm prose-p:leading-relaxed prose-strong:text-[#00E5FF]">
                                    {briefingContent.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!isGeneratingBrief && (
                            <div className="mt-12 flex gap-6 relative z-10">
                                <button className="flex-1 py-7 bg-[#00E5FF] text-black font-black rounded-[2rem] text-[12px] tracking-[0.4em] uppercase hover:bg-cyan-400 transition-all flex items-center justify-center gap-4">
                                    <FileText size={20} /> EXPORT PDF REPORT
                                </button>
                                <button onClick={() => handleGenerateBriefing(selectedDeal!)} className="flex-1 py-7 bg-slate-900 text-[#00E5FF] font-black rounded-[2rem] text-[12px] tracking-[0.4em] uppercase border border-[#00E5FF]/40 hover:bg-slate-800 transition-all flex items-center justify-center gap-4">
                                    <RefreshCw size={20} /> REGENERATE NARRATIVE
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(showAddModal || isEditing) && (
                <div className="fixed inset-0 bg-[#020617]/98 z-[100] flex items-center justify-center p-12 backdrop-blur-3xl animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl glass-panel p-16 rounded-[4.5rem] border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center mb-12 relative z-10">
                            <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                {isEditing ? 'Recalibrate' : 'Initialize'} <span className="text-[#D4AF37]">Opportunity</span>
                            </h3>
                            <button onClick={() => { setShowAddModal(false); setIsEditing(false); }} className="text-slate-600 hover:text-white bg-slate-900 p-3 rounded-full"><X size={28} /></button>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Entity / Target Organization</label>
                                    <input className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 text-base font-mono text-white focus:border-[#D4AF37] focus:outline-none transition-all shadow-inner" value={editDeal.company || ''} onChange={e => setEditDeal({ ...editDeal, company: e.target.value })} placeholder="TARGET CORP..." />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">GTM Role / Objective</label>
                                    <input className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 text-base font-mono text-white focus:border-[#D4AF37] focus:outline-none transition-all shadow-inner" value={editDeal.role || ''} onChange={e => setEditDeal({ ...editDeal, role: e.target.value })} placeholder="e.g. Senior GTM Architect..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Annualized Value ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                                        <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 pl-12 text-base font-mono text-white focus:border-[#D4AF37] focus:outline-none transition-all shadow-inner" value={editDeal.value || 0} onChange={e => setEditDeal({ ...editDeal, value: parseInt(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Pipeline Stage</label>
                                    <select className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] p-6 text-base font-mono text-white focus:border-[#D4AF37] focus:outline-none appearance-none" value={editDeal.stage} onChange={e => setEditDeal({ ...editDeal, stage: e.target.value as any })}>
                                        {Object.values(JobStage).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Win Probability Index</label>
                                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-[1.5rem] shadow-inner">
                                        <input type="range" min="0" max="100" className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]" value={editDeal.probability} onChange={e => setEditDeal({ ...editDeal, probability: parseInt(e.target.value) })} />
                                        <div className="flex justify-between mt-3 text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest">
                                            <span>Risk: {editDeal.probability && editDeal.probability < 30 ? 'High' : 'Low'}</span>
                                            <span>{editDeal.probability}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Sovereign Action</label>
                                    {isEditing && (
                                        <button onClick={() => deleteDeal(selectedDeal!.id)} className="w-full py-6 bg-red-900/10 border border-red-900/40 text-red-500 rounded-[1.5rem] flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-900/30 transition-all">
                                            <Trash2 size={16} /> PURGE REVENUE NODE
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={isEditing ? handleUpdateDeal : handleInitializeOpportunity}
                            className="w-full mt-14 py-7 bg-[#D4AF37] hover:bg-yellow-500 text-black font-black rounded-[2rem] text-[12px] tracking-[0.6em] uppercase transition-all shadow-[0_0_60px_rgba(212,175,55,0.4)] flex items-center justify-center gap-4"
                        >
                            <Zap size={20} fill="black" />
                            {isEditing ? 'COMMIT MATRIX UPDATES' : 'ESTABLISH REVENUE CORRIDOR'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
