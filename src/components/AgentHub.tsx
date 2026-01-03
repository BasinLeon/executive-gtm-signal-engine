
import React, { useState, useEffect, useMemo } from 'react';
import { UserState, NexusAgent, AgentTask, Contact } from '../types.ts';
import {
    Bot, Zap, Mail, Share2, Globe, Activity, RefreshCw, Cpu, Terminal, UserPlus,
    Link, Play, History, CheckCircle2, Clock, AlertTriangle, Sparkles,
    TrendingUp, Target, Shield, Brain, Rocket
} from 'lucide-react';

interface AgentHubProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

// Agent status colors and animations
const getStatusColor = (status: string) => {
    switch (status) {
        case 'ACTIVE': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' };
        case 'IDLE': return { bg: 'bg-slate-800/50', text: 'text-slate-500', border: 'border-slate-700/50', glow: '' };
        case 'PROCESSING': return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30', glow: 'shadow-[0_0_20px_rgba(0,229,255,0.3)]' };
        default: return { bg: 'bg-slate-800/50', text: 'text-slate-500', border: 'border-slate-700/50', glow: '' };
    }
};

export const AgentHub: React.FC<AgentHubProps> = ({ userState, updateUserState, addNotification }) => {
    const [selectedAgent, setSelectedAgent] = useState<NexusAgent | null>(userState.agents?.[0] || null);
    const [taskInput, setTaskInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const agents = userState.agents || [];
    const tasks = userState.agentTasks || [];

    const logsEndRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

    // Agent stats
    const agentStats = useMemo(() => ({
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
        activeAgents: agents.filter(a => a.status === 'ACTIVE').length,
        totalAgents: agents.length,
    }), [tasks, agents]);

    const getAgentIcon = (type: string) => {
        switch (type) {
            case 'SOCIAL': return <Share2 size={22} />;
            case 'EMAIL': return <Mail size={22} />;
            case 'WEB': return <Globe size={22} />;
            case 'INTERVIEW': return <Shield size={22} />;
            case 'NEGOTIATION': return <Target size={22} />;
            case 'LINKEDIN': return <UserPlus size={22} />;
            default: return <Bot size={22} />;
        }
    };

    const handleTaskExecution = async () => {
        if (!selectedAgent || !taskInput.trim()) return;
        setIsProcessing(true);

        if (selectedAgent.type === 'LINKEDIN') {
            setLogs([`> INITIATING CONNECTSAFELY.AI SECURE HANDSHAKE...`]);
            await new Promise(r => setTimeout(r, 800));
            setLogs(prev => [...prev, `> AUTHENTICATION VALID (Bearer Token: ************)...`]);
            await new Promise(r => setTimeout(r, 1000));
            setLogs(prev => [...prev, `> FETCHING PROFILE VISITORS (LAST 7 DAYS)...`]);
            await new Promise(r => setTimeout(r, 1500));
            setLogs(prev => [...prev, `> DETECTED 3 NEW UNIQUE VISITORS.`]);
            setLogs(prev => [...prev, `> CROSS-REFERENCING INTERNAL CRM...`]);

            const newContacts: Contact[] = [
                { id: `li-v-${Date.now()}-1`, name: 'Sarah Chen', role: 'Talent Acquisition Lead', company: 'Stripe', status: 'ACTIVE', tier: '1', strategy: 'Inbound Profile Visit', lastTouch: new Date().toISOString().split('T')[0] },
                { id: `li-v-${Date.now()}-2`, name: 'David Miller', role: 'VP of GTM', company: 'Databricks', status: 'ACTIVE', tier: '1', strategy: 'Inbound Profile Visit', lastTouch: new Date().toISOString().split('T')[0] },
                { id: `li-v-${Date.now()}-3`, name: 'Elena K.', role: 'Senior Recruiter', company: 'OpenAI', status: 'ACTIVE', tier: '2', strategy: 'Inbound Profile Visit', lastTouch: new Date().toISOString().split('T')[0] }
            ];

            await new Promise(r => setTimeout(r, 1000));
            setLogs(prev => [...prev, `> VISITOR 1: Sarah Chen (Stripe) - 2nd Degree - SENDING CONNECTION REQUEST...`]);
            await new Promise(r => setTimeout(r, 800));
            setLogs(prev => [...prev, `> VISITOR 2: David Miller (Databricks) - 1st Degree - GENERATING DM...`]);
            await new Promise(r => setTimeout(r, 800));
            setLogs(prev => [...prev, `> VISITOR 3: Elena K. (OpenAI) - 2nd Degree - SENDING CONNECTION REQUEST...`]);

            await new Promise(r => setTimeout(r, 1200));

            updateUserState({
                contacts: [...(userState.contacts || []), ...newContacts],
                xp: userState.xp + 500
            });

            setLogs(prev => [...prev, `> SYNC COMPLETE. 3 NEW LEADS ADDED TO IDENTITY CRM.`, `> SLEEPING (RATE LIMIT)...`]);
            addNotification('SUCCESS', 'Protocol Executed', '3 New Profile Visitors converted to Leads.');
            setIsProcessing(false);
            return;
        }

        setLogs([`> INITIALIZING ${selectedAgent.name.toUpperCase()} PROTOCOL...`]);
        await new Promise(r => setTimeout(r, 800));
        setLogs(prev => [...prev, `> ACCESSING NEURAL CORE [L22]...`]);
        await new Promise(r => setTimeout(r, 800));
        setLogs(prev => [...prev, `> LOADING CONTEXT: ${selectedAgent.capabilities.join(' // ')}`]);
        await new Promise(r => setTimeout(r, 1200));
        setLogs(prev => [...prev, `> SYNTHESIZING STRATEGIC OUTPUT...`]);

        try {
            await new Promise(r => setTimeout(r, 1500));

            const mockResult = `[TASK EXECUTION COMPLETE]

Agent: ${selectedAgent.name}
Objective: ${taskInput}

Generated Output:
• Strategic analysis completed
• Key recommendations identified
• Execution framework established

Next Steps:
1. Review generated output
2. Apply to target context
3. Measure impact metrics

Status: SUCCESS`;

            setLogs(prev => [...prev, `> EXECUTION SUCCESSFUL.`, `> OUTPUT GENERATED.`]);

            const newTask: AgentTask = {
                id: `task-${Date.now()}`,
                type: selectedAgent.type,
                status: 'COMPLETED',
                description: taskInput,
                result: mockResult,
                timestamp: new Date().toISOString()
            };

            updateUserState({ agentTasks: [newTask, ...tasks], xp: userState.xp + 200 });
            setTaskInput('');
            addNotification('SUCCESS', 'Operation Complete', `${selectedAgent.name} finalized the objective.`);
        } catch (e) {
            setLogs(prev => [...prev, `> CRITICAL FAILURE: SYSTEM INTERRUPT.`]);
            addNotification('ERROR', 'Link Interrupt', 'Agent failed to reach terminal state.');
        } finally { setIsProcessing(false); }
    };

    return (
        <div className="p-6 lg:p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white leading-none tracking-tighter uppercase">
                        Nexus <span className="text-[#D4AF37]">Agents</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-2">
                        Autonomous Neural Workforce // L22 Identity Shards
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                            {agentStats.activeAgents}/{agentStats.totalAgents} Active
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl">
                        <CheckCircle2 size={12} className="text-[#D4AF37]" />
                        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">
                            {agentStats.completedTasks} Tasks
                        </span>
                    </div>
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${showHistory
                                ? 'bg-cyan-500 text-black'
                                : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                    >
                        <History size={12} />
                        <span className="text-[10px] font-bold uppercase">History</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* Agent Grid */}
                <div className="w-full lg:w-[380px] flex flex-col gap-4">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 px-2 flex items-center gap-2">
                        <Brain size={12} /> Agent Fleet
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {agents.map(agent => {
                            const status = getStatusColor(agent.status);
                            const isSelected = selectedAgent?.id === agent.id;
                            return (
                                <button
                                    key={agent.id}
                                    onClick={() => { setSelectedAgent(agent); setLogs([]); }}
                                    className={`w-full p-5 rounded-2xl border transition-all relative overflow-hidden group ${isSelected
                                            ? `${status.bg} ${status.border} ${status.glow}`
                                            : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-600'
                                        }`}
                                >
                                    {/* Status indicator line */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${agent.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-700'}`} />

                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`p-3 rounded-xl transition-all ${isSelected
                                                ? `${status.bg} ${status.text} border ${status.border}`
                                                : 'bg-slate-800 text-slate-500'
                                            }`}>
                                            {getAgentIcon(agent.type)}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className={`text-sm font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-400'
                                                }`}>
                                                {agent.name}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-[9px] font-mono uppercase tracking-wider ${status.text}`}>
                                                    {agent.status}
                                                </span>
                                                <span className="text-slate-700">•</span>
                                                <span className="text-[9px] font-mono text-slate-600 uppercase">
                                                    {agent.type}
                                                </span>
                                            </div>
                                        </div>
                                        {agent.status === 'ACTIVE' && (
                                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                        )}
                                    </div>

                                    {/* Capabilities preview */}
                                    {isSelected && (
                                        <div className="mt-4 pt-3 border-t border-white/10">
                                            <div className="flex flex-wrap gap-1">
                                                {agent.capabilities.slice(0, 3).map(cap => (
                                                    <span key={cap} className="px-2 py-0.5 bg-white/5 text-[8px] font-bold uppercase text-slate-400 rounded">
                                                        {cap}
                                                    </span>
                                                ))}
                                                {agent.capabilities.length > 3 && (
                                                    <span className="px-2 py-0.5 text-[8px] font-bold text-slate-600">
                                                        +{agent.capabilities.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Panel */}
                <div className="flex-1 flex flex-col gap-4">
                    {showHistory ? (
                        /* Task History Panel */
                        <div className="flex-1 glass-panel p-6 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                    <History size={16} /> Task History
                                </h3>
                                <span className="text-[10px] font-mono text-slate-600">{tasks.length} total executions</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                {tasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-700">
                                        <Clock size={48} className="mb-4 opacity-20" />
                                        <span className="text-xs font-mono uppercase tracking-widest">No tasks executed yet</span>
                                    </div>
                                ) : (
                                    tasks.map(task => (
                                        <div key={task.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 size={14} className="text-emerald-500" />
                                                    <span className="text-[10px] font-bold uppercase text-slate-400">{task.type}</span>
                                                </div>
                                                <span className="text-[9px] font-mono text-slate-600">
                                                    {new Date(task.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-300 line-clamp-2">{task.description}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Execution Panel */
                        <div className="flex-1 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                                <Cpu size={200} />
                            </div>

                            {logs.length > 0 ? (
                                /* Live Console */
                                <div className="flex-1 bg-black/80 rounded-xl border border-slate-800 p-6 font-mono text-xs text-[#00E5FF] overflow-y-auto custom-scrollbar relative">
                                    <div className="absolute top-4 right-4 text-[9px] text-slate-600 uppercase tracking-widest font-black flex items-center gap-2">
                                        <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse" /> Live Stream
                                    </div>
                                    <div className="space-y-2">
                                        {logs.map((log, i) => (
                                            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">{log}</div>
                                        ))}
                                        <div ref={logsEndRef} />
                                    </div>
                                    {!isProcessing && (
                                        <button onClick={() => setLogs([])} className="mt-6 text-slate-500 hover:text-white underline decoration-slate-700 underline-offset-4 uppercase tracking-widest text-[9px]">
                                            Reset Console
                                        </button>
                                    )}
                                </div>
                            ) : (
                                /* Task Input */
                                <div className="flex-1 space-y-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                                            <Rocket size={16} className="text-[#D4AF37]" />
                                            {selectedAgent?.name || 'Select Agent'}
                                        </h3>
                                        {selectedAgent && (
                                            <span className={`text-[9px] font-mono uppercase px-2 py-1 rounded ${getStatusColor(selectedAgent.status).bg} ${getStatusColor(selectedAgent.status).text}`}>
                                                {selectedAgent.status}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl focus-within:border-[#D4AF37] transition-colors">
                                        <textarea
                                            className="w-full h-32 bg-transparent text-slate-200 font-mono text-sm focus:outline-none placeholder:text-slate-800 resize-none"
                                            placeholder={`>> Initialize Protocol for ${selectedAgent?.name || 'Agent'}...`}
                                            value={taskInput}
                                            onChange={e => setTaskInput(e.target.value)}
                                        />
                                    </div>

                                    {/* Capabilities */}
                                    {selectedAgent && (
                                        <div className="p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl">
                                            <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-2">Capabilities</div>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedAgent.capabilities.map(cap => (
                                                    <span key={cap} className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded text-[9px] font-bold uppercase border border-[#D4AF37]/20">
                                                        {cap}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Execute Button */}
                            <button
                                onClick={handleTaskExecution}
                                disabled={isProcessing || (!taskInput.trim() && logs.length === 0)}
                                className={`w-full py-5 mt-4 rounded-2xl font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3 ${isProcessing
                                        ? 'bg-slate-900 text-slate-600'
                                        : 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} fill="black" />}
                                {isProcessing ? "NEURAL SYNC IN PROGRESS..." : (logs.length > 0 ? "EXECUTION COMPLETE" : "AUTHORIZE DEPLOYMENT")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
