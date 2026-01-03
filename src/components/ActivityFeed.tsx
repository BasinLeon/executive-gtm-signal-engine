import React from 'react';
import { Activity, Users, Briefcase, Zap, GraduationCap, Trophy, Target, Clock } from 'lucide-react';

export interface ActivityItem {
    id: string;
    type: 'CONTACT_ADDED' | 'DEAL_MOVED' | 'DEAL_CLOSED' | 'XP_EARNED' | 'DOJO_SESSION' | 'AGENT_TASK';
    title: string;
    description?: string;
    timestamp: Date;
    xpEarned?: number;
    metadata?: Record<string, any>;
}

interface ActivityFeedProps {
    activities: ActivityItem[];
    maxItems?: number;
}

const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
        case 'CONTACT_ADDED': return <Users className="w-4 h-4" />;
        case 'DEAL_MOVED': return <Briefcase className="w-4 h-4" />;
        case 'DEAL_CLOSED': return <Trophy className="w-4 h-4" />;
        case 'XP_EARNED': return <Zap className="w-4 h-4" />;
        case 'DOJO_SESSION': return <GraduationCap className="w-4 h-4" />;
        case 'AGENT_TASK': return <Target className="w-4 h-4" />;
        default: return <Activity className="w-4 h-4" />;
    }
};

const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
        case 'CONTACT_ADDED': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
        case 'DEAL_MOVED': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'DEAL_CLOSED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'XP_EARNED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        case 'DOJO_SESSION': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'AGENT_TASK': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
};

const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, maxItems = 10 }) => {
    const displayedActivities = activities.slice(0, maxItems);

    if (displayedActivities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                <Activity className="w-8 h-8 mb-3 opacity-50" />
                <span className="text-xs font-mono uppercase tracking-widest">No recent activity</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Recent Activity
                </h3>
                <span className="text-[10px] font-mono text-slate-600">{activities.length} events</span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {displayedActivities.map((activity) => (
                    <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors group"
                    >
                        <div className={`p-2 rounded-lg border ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-white truncate">{activity.title}</span>
                                {activity.xpEarned && (
                                    <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                                        +{activity.xpEarned} XP
                                    </span>
                                )}
                            </div>
                            {activity.description && (
                                <p className="text-xs text-slate-500 truncate mt-0.5">{activity.description}</p>
                            )}
                            <span className="text-[10px] text-slate-600 font-mono mt-1 block">
                                {formatTimeAgo(activity.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
