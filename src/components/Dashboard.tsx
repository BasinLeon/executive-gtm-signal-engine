
import React, { useEffect, useState, useMemo } from 'react';
import { UserState, AppView, Contact, JobStage, JobDeal, MarketSignal } from '../types.ts';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip } from 'recharts';
import {
    TrendingUp, Compass, Award, Globe, Users, Zap, AlertCircle, Bot, Target, Edit2, Plus, ArrowUpRight, Activity, Radar as RadarIcon, Briefcase, ChevronRight, Sparkles, LayoutGrid, Timer, RefreshCw
} from 'lucide-react';
import { getHiringVelocity, fetchMarketSignals, getQuantumDiagnostics } from '../services/geminiService.ts';

interface DashboardProps {
    userState: UserState;
    setView: (view: AppView) => void;
    onPrepJob: (job: JobDeal) => void;
    onSimulateCall: (contact: Contact) => void;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userState, setView, onPrepJob, onSimulateCall, updateUserState, addNotification }) => {
    const [marketSignals, setMarketSignals] = useState<MarketSignal[]>([]);
    const [isEditingTarget, setIsEditingTarget] = useState(false);
    const [tempTarget, setTempTarget] = useState(userState.revenueTarget || 3000000);

    useEffect(() => {
        const companies = (userState.pipeline || []).map(d => d.company);
        fetchMarketSignals(companies).then(setMarketSignals);
        getHiringVelocity();
        getQuantumDiagnostics(userState);
    }, [userState.pipeline?.length]);

    const stats = useMemo(() => {
        const pipeline = userState.pipeline || [];
        const totalValue = pipeline.reduce((acc, deal) => acc + (deal.value || 0), 0);
        const weightedValue = pipeline.reduce((acc, deal) => acc + ((deal.value || 0) * (deal.probability / 100)), 0);

        const distribution = [
            { name: 'Offer', value: pipeline.filter(d => d.stage === JobStage.OFFER).reduce((a, b) => a + (b.value || 0), 0) },
            { name: 'Interview', value: pipeline.filter(d => d.stage === JobStage.INTERVIEWING).reduce((a, b) => a + (b.value || 0), 0) },
            { name: 'Engaged', value: pipeline.filter(d => d.stage === JobStage.APPLIED).reduce((a, b) => a + (b.value || 0), 0) },
            { name: 'Targets', value: pipeline.filter(d => d.stage === JobStage.TARGET).reduce((a, b) => a + (b.value || 0), 0) },
        ];
        return { totalValue, weightedValue, distribution };
    }, [userState.pipeline]);

    const saveTarget = () => {
        updateUserState({ revenueTarget: tempTarget });
        setIsEditingTarget(false);
        addNotification('SUCCESS', 'Target Recalibrated', `Annual GTM target set to $${(tempTarget / 1000000).toFixed(1)}M`);
    };

    const gapToGoal = Math.max(0, tempTarget - stats.weightedValue);

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto bg-[#020617] custom-scrollbar animate-in fade-in duration-500 overflow-x-hidden">

            {/* HEADER HUD */}
            <div className="flex flex-col xl:flex-row justify-between items-start mb-8 gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="h-[2px] w-16 bg-gradient-to-r from-[#00E5FF] to-transparent"></div>
                        <span className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-[0.8em] font-black">Nexus Command // v9.0 Sovereign</span>
                    </div>
                    <h1 className="text-6xl md:text-9xl font-black text-white leading-none tracking-[-0.08em] uppercase select-none">
                        War <span className="text-[#D4AF37] italic opacity-90">Room</span>
                    </h1>
                </div>
                <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 flex-1 md:min-w-[280px] relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><Target size={120} /></div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-2 flex justify-between items-center relative z-10">
                            <span className="tracking-[0.2em]">Revenue Target</span>
                            <button onClick={() => setIsEditingTarget(!isEditingTarget)} className="text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#D4AF37]/10 rounded">
                                <Edit2 size={12} />
                            </button>
                        </div>
                        {isEditingTarget ? (
                            <div className="mt-2 flex gap-3 relative z-10">
                                <input
                                    type="number"
                                    className="bg-black/50 border border-slate-700 text-white font-mono text-lg p-2 rounded-xl w-36 focus:border-[#D4AF37] outline-none"
                                    value={tempTarget}
                                    onChange={e => setTempTarget(parseInt(e.target.value))}
                                />
                                <button onClick={saveTarget} className="bg-[#D4AF37] text-black text-[10px] px-4 rounded-xl font-black tracking-widest hover:scale-105 active:scale-95 transition-transform">SAVE</button>
                            </div>
                        ) : (
                            <div className="text-5xl font-mono font-bold text-white tracking-tighter relative z-10">${(tempTarget / 1000000).toFixed(1)}M</div>
                        )}
                    </div>
                    <div className="bg-[#D4AF37]/5 p-10 rounded-[2.5rem] border border-[#D4AF37]/30 flex-1 md:min-w-[320px] relative group overflow-hidden">
                        <div className="absolute top-0 left-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform"><TrendingUp size={120} /></div>
                        <div className="text-[11px] text-[#D4AF37] uppercase font-black mb-3 flex justify-between relative z-10">
                            <span className="tracking-[0.2em]">Sovereign Forecast</span>
                            <span className="text-emerald-500 font-mono text-[9px] flex items-center gap-1 font-black uppercase">+12.4% VELOCITY</span>
                        </div>
                        <div className="text-5xl font-mono font-bold text-[#D4AF37] tracking-tighter relative z-10">
                            {stats.weightedValue >= 1000000
                                ? `$${(stats.weightedValue / 1000000).toFixed(1)}M`
                                : `$${(stats.weightedValue / 1000).toFixed(0)}K`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[65vh]">
                {/* Market Intelligence Feed */}
                <div className="col-span-1 lg:col-span-4 glass-panel p-10 rounded-[3.5rem] border border-slate-800 h-[500px] lg:h-full flex flex-col relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 text-[#00E5FF] group-hover:rotate-12 transition-transform duration-1000"><Globe size={180} /></div>
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#00E5FF]/20 rounded-xl">
                                <Activity size={20} className="text-[#00E5FF] animate-pulse" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Market Pulse</h3>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 relative z-10 pr-2">
                        {marketSignals.map(sig => (
                            <div key={sig.id} className="p-6 bg-slate-950/50 border border-slate-800 hover:border-[#00E5FF]/50 rounded-2xl group/sig transition-all cursor-pointer relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00E5FF] opacity-50 group-hover/sig:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[9px] font-mono text-[#00E5FF] uppercase font-black tracking-widest bg-[#00E5FF]/10 px-2 py-1 rounded">{sig.company}</span>
                                    <span className="text-[9px] text-slate-600 font-mono">{sig.date}</span>
                                </div>
                                <p className="text-xs text-slate-300 font-bold leading-relaxed tracking-tight group-hover/sig:text-white transition-colors">{sig.headline}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Corridor Graph */}
                <div className="col-span-1 lg:col-span-8 glass-panel p-10 rounded-[3.5rem] border border-slate-800 h-[500px] lg:h-full flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#D4AF37]/5 pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#D4AF37]/20 rounded-xl">
                                <TrendingUp size={20} className="text-[#D4AF37]" />
                            </div>
                            <div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Corridor Distribution</h3>
                                <p className="text-[9px] text-slate-600 font-mono uppercase tracking-widest mt-1">Weighted Pipeline Valuation</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-black text-white tracking-tighter">
                                {gapToGoal >= 1000000
                                    ? `$${(gapToGoal / 1000000).toFixed(1)}M`
                                    : `$${(gapToGoal / 1000).toFixed(0)}K`}
                            </div>
                            <div className="text-[9px] text-[#D4AF37] font-mono uppercase tracking-widest mt-1">Gap to Goal</div>
                        </div>
                    </div>
                    <div className="flex-1 w-full relative z-10 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.distribution} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 10 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 800, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.05em' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff', opacity: 0.05 }}
                                    contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '16px', color: '#fff', padding: '12px 20px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}
                                    formatter={(value: number) => [
                                        value >= 1000000 ? `$${(value / 1000000).toFixed(1)}M` : `$${(value / 1000).toFixed(0)}K`,
                                        'Value'
                                    ]}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40} animationDuration={1500}>
                                    {stats.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#00E5FF' : index === 2 ? '#6366f1' : '#334155'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
