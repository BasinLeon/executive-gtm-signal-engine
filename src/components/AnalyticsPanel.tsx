import React, { useMemo } from 'react';
import { UserState, JobStage } from '../types.ts';
import {
    TrendingUp, Users, Briefcase, Target, Activity, Zap,
    ArrowUpRight, ArrowDownRight, Award, Clock, Calendar
} from 'lucide-react';

interface AnalyticsPanelProps {
    userState: UserState;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ userState }) => {
    const metrics = useMemo(() => {
        const pipeline = userState.pipeline || [];
        const contacts = userState.contacts || [];
        const tasks = userState.agentTasks || [];

        // Pipeline metrics
        const totalValue = pipeline.reduce((acc, d) => acc + (d.value || 0), 0);
        const weightedValue = pipeline.reduce((acc, d) => acc + ((d.value || 0) * (d.probability / 100)), 0);
        const avgProbability = pipeline.length > 0
            ? Math.round(pipeline.reduce((acc, d) => acc + d.probability, 0) / pipeline.length)
            : 0;

        // Stage distribution
        const stageDistribution = {
            target: pipeline.filter(d => d.stage === JobStage.TARGET).length,
            applied: pipeline.filter(d => d.stage === JobStage.APPLIED).length,
            interview: pipeline.filter(d => d.stage === JobStage.INTERVIEWING).length,
            offer: pipeline.filter(d => d.stage === JobStage.OFFER).length,
            closed: pipeline.filter(d => d.stage === JobStage.CLOSED).length,
        };

        // Contact metrics
        const tier1Contacts = contacts.filter(c => c.tier === '1').length;
        const activeContacts = contacts.filter(c => c.status === 'ACTIVE').length;

        // XP and Level
        const xp = userState.xp || 0;
        const level = xp >= 12000 ? 7 : xp >= 8000 ? 6 : xp >= 5000 ? 5 : xp >= 3000 ? 4 : xp >= 1500 ? 3 : xp >= 500 ? 2 : 1;
        const nextLevelXP = [500, 1500, 3000, 5000, 8000, 12000, Infinity][level - 1];
        const prevLevelXP = [0, 500, 1500, 3000, 5000, 8000, 12000][level - 1];
        const levelProgress = ((xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;

        return {
            totalValue,
            weightedValue,
            avgProbability,
            stageDistribution,
            totalDeals: pipeline.length,
            totalContacts: contacts.length,
            tier1Contacts,
            activeContacts,
            completedTasks: tasks.length,
            xp,
            level,
            levelProgress,
            streak: userState.streak || 0,
        };
    }, [userState]);

    const StatCard = ({
        icon,
        label,
        value,
        subValue,
        trend,
        color = 'slate'
    }: {
        icon: React.ReactNode;
        label: string;
        value: string | number;
        subValue?: string;
        trend?: 'up' | 'down' | 'neutral';
        color?: string;
    }) => (
        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors group">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[9px] font-bold ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-500'
                        }`}>
                        {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : null}
                        {trend === 'up' ? '+12%' : trend === 'down' ? '-5%' : '0%'}
                    </div>
                )}
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-1">{label}</div>
            {subValue && <div className="text-[8px] text-slate-600 mt-0.5">{subValue}</div>}
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity size={16} className="text-[#D4AF37]" /> Analytics Overview
                </h3>
                <span className="text-[9px] font-mono text-slate-600">Last 30 days</span>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    icon={<Briefcase size={14} />}
                    label="Pipeline Value"
                    value={metrics.totalValue >= 1000000 ? `$${(metrics.totalValue / 1000000).toFixed(1)}M` : `$${(metrics.totalValue / 1000).toFixed(0)}K`}
                    subValue={`Weighted: $${(metrics.weightedValue / 1000).toFixed(0)}K`}
                    trend="up"
                    color="emerald"
                />
                <StatCard
                    icon={<Target size={14} />}
                    label="Win Probability"
                    value={`${metrics.avgProbability}%`}
                    subValue={`${metrics.totalDeals} active deals`}
                    trend="up"
                    color="cyan"
                />
                <StatCard
                    icon={<Users size={14} />}
                    label="Network Size"
                    value={metrics.totalContacts}
                    subValue={`${metrics.tier1Contacts} Tier 1 contacts`}
                    trend="neutral"
                    color="purple"
                />
                <StatCard
                    icon={<Zap size={14} />}
                    label="Agent Tasks"
                    value={metrics.completedTasks}
                    subValue="Automated actions"
                    trend="up"
                    color="yellow"
                />
            </div>

            {/* Pipeline Funnel */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <TrendingUp size={12} /> Pipeline Funnel
                </div>
                <div className="flex gap-1 h-8">
                    {Object.entries(metrics.stageDistribution).map(([stage, count], i) => {
                        const colors = ['bg-slate-600', 'bg-blue-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-[#D4AF37]'];
                        const total = metrics.totalDeals || 1;
                        const width = Math.max((count / total) * 100, 5);
                        return (
                            <div
                                key={stage}
                                className={`${colors[i]} rounded transition-all hover:opacity-80 relative group`}
                                style={{ width: `${width}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap capitalize">
                                    {stage}: {count}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-[8px] font-mono text-slate-600 uppercase">
                    <span>Target</span>
                    <span>Applied</span>
                    <span>Interview</span>
                    <span>Offer</span>
                    <span>Won</span>
                </div>
            </div>

            {/* XP Progress */}
            <div className="p-4 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Award size={14} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-bold text-white uppercase">Level {metrics.level} Progress</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#D4AF37]">{metrics.xp.toLocaleString()} XP</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 transition-all duration-500"
                        style={{ width: `${Math.min(metrics.levelProgress, 100)}%` }}
                    />
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="flex gap-3">
                <div className="flex-1 p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <Clock size={14} className="text-orange-400" />
                    </div>
                    <div>
                        <div className="text-lg font-black text-white">{metrics.streak}</div>
                        <div className="text-[8px] font-mono text-slate-600 uppercase">Day Streak</div>
                    </div>
                </div>
                <div className="flex-1 p-3 bg-slate-900/50 border border-slate-800 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <Calendar size={14} className="text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-lg font-black text-white">{metrics.activeContacts}</div>
                        <div className="text-[8px] font-mono text-slate-600 uppercase">Active Leads</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPanel;
