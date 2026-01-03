import React, { useMemo } from 'react';
import { Flame, Trophy, Star, Zap, Target, Award, Crown, Sparkles, TrendingUp } from 'lucide-react';

interface GamificationPanelProps {
    xp: number;
    streak?: number;
    sessionsCompleted?: number;
    dealsWon?: number;
    contactsAdded?: number;
}

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    color: string;
}

interface Level {
    level: number;
    title: string;
    minXP: number;
    maxXP: number;
    color: string;
}

const LEVELS: Level[] = [
    { level: 1, title: 'Initiate', minXP: 0, maxXP: 500, color: 'text-slate-400' },
    { level: 2, title: 'Apprentice', minXP: 500, maxXP: 1500, color: 'text-cyan-400' },
    { level: 3, title: 'Operator', minXP: 1500, maxXP: 3000, color: 'text-blue-400' },
    { level: 4, title: 'Strategist', minXP: 3000, maxXP: 5000, color: 'text-purple-400' },
    { level: 5, title: 'Architect', minXP: 5000, maxXP: 8000, color: 'text-orange-400' },
    { level: 6, title: 'Commander', minXP: 8000, maxXP: 12000, color: 'text-red-400' },
    { level: 7, title: 'Sovereign', minXP: 12000, maxXP: Infinity, color: 'text-[#D4AF37]' },
];

export const GamificationPanel: React.FC<GamificationPanelProps> = ({
    xp = 0,
    streak = 0,
    sessionsCompleted = 0,
    dealsWon = 0,
    contactsAdded = 0,
}) => {
    const currentLevel = useMemo(() => {
        return LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[LEVELS.length - 1];
    }, [xp]);

    const nextLevel = useMemo(() => {
        const idx = LEVELS.findIndex(l => l.level === currentLevel.level);
        return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
    }, [currentLevel]);

    const progressPercent = useMemo(() => {
        if (!nextLevel) return 100;
        const levelXP = xp - currentLevel.minXP;
        const levelRange = currentLevel.maxXP - currentLevel.minXP;
        return Math.min(100, Math.round((levelXP / levelRange) * 100));
    }, [xp, currentLevel, nextLevel]);

    const xpToNextLevel = useMemo(() => {
        if (!nextLevel) return 0;
        return currentLevel.maxXP - xp;
    }, [xp, currentLevel, nextLevel]);

    const badges: Badge[] = useMemo(() => [
        {
            id: 'first_contact',
            name: 'First Contact',
            description: 'Add your first contact',
            icon: <Star className="w-5 h-5" />,
            unlocked: contactsAdded >= 1,
            color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
        },
        {
            id: 'deal_maker',
            name: 'Deal Maker',
            description: 'Close your first deal',
            icon: <Trophy className="w-5 h-5" />,
            unlocked: dealsWon >= 1,
            color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        },
        {
            id: 'streak_3',
            name: 'On Fire',
            description: '3-day streak',
            icon: <Flame className="w-5 h-5" />,
            unlocked: streak >= 3,
            color: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
        },
        {
            id: 'streak_7',
            name: 'Unstoppable',
            description: '7-day streak',
            icon: <Zap className="w-5 h-5" />,
            unlocked: streak >= 7,
            color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        },
        {
            id: 'dojo_master',
            name: 'Dojo Master',
            description: 'Complete 5 Dojo sessions',
            icon: <Target className="w-5 h-5" />,
            unlocked: sessionsCompleted >= 5,
            color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
        },
        {
            id: 'sovereign',
            name: 'Sovereign',
            description: 'Reach Level 7',
            icon: <Crown className="w-5 h-5" />,
            unlocked: currentLevel.level >= 7,
            color: 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30'
        },
    ], [contactsAdded, dealsWon, streak, sessionsCompleted, currentLevel]);

    const unlockedBadges = badges.filter(b => b.unlocked);
    const lockedBadges = badges.filter(b => !b.unlocked);

    return (
        <div className="space-y-6">
            {/* Level & XP Progress */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#D4AF37]/20 rounded-xl border border-[#D4AF37]/30">
                            <Award className={`w-6 h-6 ${currentLevel.color}`} />
                        </div>
                        <div>
                            <div className="text-xs font-black uppercase tracking-widest text-slate-500">Level {currentLevel.level}</div>
                            <div className={`text-xl font-black ${currentLevel.color}`}>{currentLevel.title}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-white font-mono">{xp.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">Total XP</div>
                    </div>
                </div>

                {/* XP Progress Bar */}
                <div className="space-y-2">
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-600">
                        <span>{progressPercent}% to next level</span>
                        {nextLevel && <span>{xpToNextLevel.toLocaleString()} XP needed</span>}
                    </div>
                </div>
            </div>

            {/* Streak Counter */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-950/50 to-slate-950 rounded-2xl p-5 border border-orange-800/30">
                    <div className="flex items-center gap-3">
                        <Flame className={`w-8 h-8 ${streak > 0 ? 'text-orange-400 animate-pulse' : 'text-slate-600'}`} />
                        <div>
                            <div className="text-3xl font-black text-white">{streak}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Day Streak</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-950/50 to-slate-950 rounded-2xl p-5 border border-emerald-800/30">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-emerald-400" />
                        <div>
                            <div className="text-3xl font-black text-white">{sessionsCompleted}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Sessions</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Achievements
                    </h3>
                    <span className="text-[10px] font-mono text-slate-600">
                        {unlockedBadges.length}/{badges.length}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`p-4 rounded-xl border text-center transition-all ${badge.unlocked
                                    ? `${badge.color} hover:scale-105`
                                    : 'bg-slate-900/50 text-slate-700 border-slate-800 opacity-50'
                                }`}
                            title={badge.description}
                        >
                            <div className="flex justify-center mb-2">
                                {badge.icon}
                            </div>
                            <div className="text-[9px] font-bold uppercase tracking-wider truncate">
                                {badge.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamificationPanel;
