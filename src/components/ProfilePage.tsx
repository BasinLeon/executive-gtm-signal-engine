import React, { useMemo, useRef } from 'react';
import { UserState, JobStage } from '../types.ts';
import {
    User, Award, Trophy, Flame, Target, Zap, Star, Crown,
    TrendingUp, Users, Briefcase, Brain, Download, Share2,
    CheckCircle2, Lock, Calendar, Clock, Medal
} from 'lucide-react';

interface ProfilePageProps {
    userState: UserState;
    addNotification?: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

// Achievement definitions
const ACHIEVEMENTS = [
    { id: 'first_contact', name: 'First Contact', icon: <Users size={20} />, desc: 'Add your first contact', requirement: (u: UserState) => (u.contacts?.length || 0) >= 1 },
    { id: 'network_builder', name: 'Network Builder', icon: <Users size={20} />, desc: 'Add 25 contacts', requirement: (u: UserState) => (u.contacts?.length || 0) >= 25 },
    { id: 'power_networker', name: 'Power Networker', icon: <Users size={20} />, desc: 'Add 100 contacts', requirement: (u: UserState) => (u.contacts?.length || 0) >= 100 },
    { id: 'deal_maker', name: 'Deal Maker', icon: <Briefcase size={20} />, desc: 'Close your first deal', requirement: (u: UserState) => (u.pipeline?.filter(d => d.stage === JobStage.CLOSED).length || 0) >= 1 },
    { id: 'million_dollar', name: 'Million Dollar Pipeline', icon: <Trophy size={20} />, desc: 'Reach $1M in pipeline value', requirement: (u: UserState) => (u.pipeline?.reduce((a, d) => a + (d.value || 0), 0) || 0) >= 1000000 },
    { id: 'on_fire', name: 'On Fire', icon: <Flame size={20} />, desc: '3-day streak', requirement: (u: UserState) => (u.streak || 0) >= 3 },
    { id: 'unstoppable', name: 'Unstoppable', icon: <Flame size={20} />, desc: '7-day streak', requirement: (u: UserState) => (u.streak || 0) >= 7 },
    { id: 'legendary', name: 'Legendary', icon: <Flame size={20} />, desc: '30-day streak', requirement: (u: UserState) => (u.streak || 0) >= 30 },
    { id: 'apprentice', name: 'Apprentice', icon: <Star size={20} />, desc: 'Reach Level 2', requirement: (u: UserState) => (u.xp || 0) >= 500 },
    { id: 'strategist', name: 'Strategist', icon: <Brain size={20} />, desc: 'Reach Level 4', requirement: (u: UserState) => (u.xp || 0) >= 3000 },
    { id: 'commander', name: 'Commander', icon: <Medal size={20} />, desc: 'Reach Level 6', requirement: (u: UserState) => (u.xp || 0) >= 8000 },
    { id: 'sovereign', name: 'Sovereign', icon: <Crown size={20} />, desc: 'Reach Level 7', requirement: (u: UserState) => (u.xp || 0) >= 12000 },
    { id: 'agent_master', name: 'Agent Master', icon: <Zap size={20} />, desc: 'Complete 10 agent tasks', requirement: (u: UserState) => (u.agentTasks?.length || 0) >= 10 },
    { id: 'dojo_warrior', name: 'Dojo Warrior', icon: <Target size={20} />, desc: 'Complete 5 practice sessions', requirement: (u: UserState) => (u.agentTasks?.length || 0) >= 5 },
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ userState, addNotification }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Calculate user stats
    const stats = useMemo(() => {
        const xp = userState.xp || 0;
        const levels = [
            { level: 1, title: 'Initiate', xp: 0 },
            { level: 2, title: 'Apprentice', xp: 500 },
            { level: 3, title: 'Operator', xp: 1500 },
            { level: 4, title: 'Strategist', xp: 3000 },
            { level: 5, title: 'Architect', xp: 5000 },
            { level: 6, title: 'Commander', xp: 8000 },
            { level: 7, title: 'Sovereign', xp: 12000 },
        ];

        const currentLevel = levels.reduce((acc, l) => xp >= l.xp ? l : acc, levels[0]);
        const nextLevel = levels[currentLevel.level] || levels[6];
        const progress = currentLevel.level === 7 ? 100 : ((xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100;

        const unlockedAchievements = ACHIEVEMENTS.filter(a => a.requirement(userState));

        return {
            xp,
            level: currentLevel.level,
            title: currentLevel.title,
            nextLevelXp: nextLevel.xp,
            progress,
            streak: userState.streak || 0,
            contacts: userState.contacts?.length || 0,
            deals: userState.pipeline?.length || 0,
            pipelineValue: userState.pipeline?.reduce((a, d) => a + (d.value || 0), 0) || 0,
            achievementsUnlocked: unlockedAchievements.length,
            totalAchievements: ACHIEVEMENTS.length,
        };
    }, [userState]);

    const handleExportCard = () => {
        addNotification?.('SUCCESS', 'Player Card Ready', 'Screenshot or share your profile!');
    };

    return (
        <div className="p-6 lg:p-8 h-full overflow-y-auto bg-[#020617] animate-in fade-in">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Player Card */}
                <div
                    ref={cardRef}
                    className="glass-panel p-8 rounded-[2rem] border border-[#D4AF37]/30 bg-gradient-to-br from-slate-900 to-black relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-yellow-600 flex items-center justify-center text-black text-3xl font-black shadow-2xl">
                                    LB
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Leon Basin</h1>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg text-xs font-bold uppercase border border-[#D4AF37]/30">
                                            Level {stats.level} {stats.title}
                                        </span>
                                        <span className="text-slate-500 text-sm font-mono">{stats.xp.toLocaleString()} XP</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-2">GTM Leader • Revenue Architect • Growth Sovereign</p>
                                </div>
                            </div>
                            <button
                                onClick={handleExportCard}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                <Share2 size={14} /> Share
                            </button>
                        </div>

                        {/* XP Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Progress to Level {stats.level + 1}</span>
                                <span className="text-[10px] font-mono text-[#D4AF37]">{stats.xp.toLocaleString()} / {stats.nextLevelXp.toLocaleString()} XP</span>
                            </div>
                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 transition-all duration-1000"
                                    style={{ width: `${Math.min(stats.progress, 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Flame size={16} className="text-orange-400" />
                                    <span className="text-[9px] font-bold uppercase text-slate-500">Streak</span>
                                </div>
                                <div className="text-2xl font-black text-white">{stats.streak} days</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={16} className="text-cyan-400" />
                                    <span className="text-[9px] font-bold uppercase text-slate-500">Network</span>
                                </div>
                                <div className="text-2xl font-black text-white">{stats.contacts}</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase size={16} className="text-emerald-400" />
                                    <span className="text-[9px] font-bold uppercase text-slate-500">Pipeline</span>
                                </div>
                                <div className="text-2xl font-black text-white">
                                    ${stats.pipelineValue >= 1000000 ? `${(stats.pipelineValue / 1000000).toFixed(1)}M` : `${(stats.pipelineValue / 1000).toFixed(0)}K`}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy size={16} className="text-[#D4AF37]" />
                                    <span className="text-[9px] font-bold uppercase text-slate-500">Achievements</span>
                                </div>
                                <div className="text-2xl font-black text-white">{stats.achievementsUnlocked}/{stats.totalAchievements}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Gallery */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Award size={18} className="text-[#D4AF37]" /> Achievements
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {ACHIEVEMENTS.map(achievement => {
                            const isUnlocked = achievement.requirement(userState);
                            return (
                                <div
                                    key={achievement.id}
                                    className={`p-4 rounded-xl border transition-all relative group ${isUnlocked
                                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 hover:border-[#D4AF37]'
                                        : 'bg-slate-900/50 border-slate-800 opacity-50'
                                        }`}
                                >
                                    <div className={`mb-2 ${isUnlocked ? 'text-[#D4AF37]' : 'text-slate-600'}`}>
                                        {achievement.icon}
                                    </div>
                                    <div className={`text-[10px] font-bold uppercase ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                                        {achievement.name}
                                    </div>
                                    {!isUnlocked && (
                                        <Lock size={12} className="absolute top-2 right-2 text-slate-700" />
                                    )}
                                    {isUnlocked && (
                                        <CheckCircle2 size={12} className="absolute top-2 right-2 text-emerald-500" />
                                    )}

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-slate-700">
                                        {achievement.desc}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Career Timeline */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-cyan-400" /> Career Timeline
                    </h2>
                    <div className="space-y-4">
                        {[
                            { date: 'Jan 2026', title: 'Sovereign Mode Activated', desc: 'Deployed BASIN::NEXUS v9.0', icon: <Crown size={16} /> },
                            { date: 'Jan 2026', title: 'Pipeline Expansion', desc: 'Added $1.5M in opportunities', icon: <TrendingUp size={16} /> },
                            { date: 'Dec 2025', title: 'Network Growth', desc: 'Built 100+ active connections', icon: <Users size={16} /> },
                            { date: 'Nov 2025', title: 'GTM System Launch', desc: 'Initialized executive operations', icon: <Zap size={16} /> },
                        ].map((event, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                                    {event.icon}
                                </div>
                                <div className="flex-1 pb-4 border-b border-slate-800 last:border-0">
                                    <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{event.date}</div>
                                    <div className="text-sm font-bold text-white mt-1">{event.title}</div>
                                    <div className="text-xs text-slate-400">{event.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
