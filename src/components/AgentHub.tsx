
import React, { useState, useEffect } from 'react';
import { UserState, NexusAgent, AgentTask, Contact } from '../types.ts';
import {
    Bot, Zap, Mail, Share2, Globe, Activity, RefreshCw, Cpu, Terminal, UserPlus, Link
} from 'lucide-react';
// GoogleGenAI removed - using mock execution for offline use

interface AgentHubProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const AgentHub: React.FC<AgentHubProps> = ({ userState, updateUserState, addNotification }) => {
    const [selectedAgent, setSelectedAgent] = useState<NexusAgent | null>(userState.agents?.[0] || null);
    const [taskInput, setTaskInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [neuralSyncPct, setNeuralSyncPct] = useState(0);

    const agents = userState.agents || [];
    const tasks = userState.agentTasks || [];

    useEffect(() => {
        const timer = setInterval(() => {
            setNeuralSyncPct(prev => (prev < 99 ? prev + 1 : 99));
        }, 50);
        return () => clearInterval(timer);
    }, []);

    const [logs, setLogs] = useState<string[]>([]);

    // Auto-scroll logs
    const logsEndRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

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

            // Generate mock contacts
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

            // Actually update state
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
            // Mock task execution - works without API
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

    const getAgentIcon = (type: string) => {
        switch (type) {
            case 'SOCIAL': return <Share2 size={24} />;
            case 'EMAIL': return <Mail size={24} />;
            case 'WEB': return <Globe size={24} />;
            case 'INTERVIEW': return <Activity size={24} />;
            case 'NEGOTIATION': return <Terminal size={24} />;
            case 'LINKEDIN': return <UserPlus size={24} />;
            default: return <Bot size={24} />;
        }
    };

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700 overflow-hidden">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">Nexus <span className="text-[#D4AF37]">Agents</span></h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">Autonomous Neural Workforce // L22 Identity Shards</p>
                </div>
                <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
                    <div className="px-6 py-3 rounded-xl bg-slate-800 text-[#D4AF37] text-[9px] font-black uppercase tracking-widest border border-[#D4AF37]/20 flex items-center gap-3">
                        <Activity size={14} className="animate-pulse" /> Node Status: ACTIVE
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
                <div className="w-full lg:w-[440px] flex flex-col gap-6">
                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-4">
                        {agents.map(agent => (
                            <button
                                key={agent.id}
                                onClick={() => { setSelectedAgent(agent); setLogs([]); }}
                                className={`w-full p-8 rounded-[2.5rem] border text-left transition-all relative overflow-hidden group ${selectedAgent?.id === agent.id ? 'bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-600'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none"></div>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className={`p-4 rounded-2xl ${selectedAgent?.id === agent.id ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_#D4AF37]' : 'bg-slate-800 text-slate-500'}`}>
                                        {getAgentIcon(agent.type)}
                                    </div>
                                    <div>
                                        <div className={`text-lg font-black uppercase tracking-tighter ${selectedAgent?.id === agent.id ? 'text-white' : 'text-slate-400'}`}>{agent.name}</div>
                                        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1 group-hover:text-[#D4AF37] transition-colors">{agent.status} // {agent.type}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-8">
                    <div className="glass-panel p-12 rounded-[3.5rem] border border-slate-800 flex flex-col shadow-2xl bg-black/40 h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Cpu size={300} /></div>

                        {(logs.length > 0) ? (
                            <div className="flex-1 bg-black/80 rounded-3xl border border-slate-800 p-8 font-mono text-xs text-[#00E5FF] overflow-y-auto custom-scrollbar relative">
                                <div className="absolute top-4 right-4 text-[9px] text-slate-600 uppercase tracking-widest font-black flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-pulse"></div> Live Stream
                                </div>
                                <div className="space-y-2">
                                    {logs.map((log, i) => (
                                        <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">{log}</div>
                                    ))}
                                    <div ref={logsEndRef} />
                                </div>
                                {!isProcessing && (
                                    <button onClick={() => setLogs([])} className="mt-8 text-slate-500 hover:text-white underline decoration-slate-700 underline-offset-4 uppercase tracking-widest text-[9px]">Reset Console</button>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 space-y-8 relative z-10">
                                <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-3xl relative overflow-hidden group focus-within:border-[#D4AF37] transition-colors">
                                    <textarea
                                        className="w-full h-40 bg-transparent text-slate-200 font-mono text-lg focus:outline-none placeholder:text-slate-800 resize-none selection:bg-[#D4AF37]/30"
                                        placeholder={`>> Initialize Protocol for ${selectedAgent?.name || 'Agent'}...`}
                                        value={taskInput}
                                        onChange={e => setTaskInput(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50">
                                        <div className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-2">Capabilities</div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedAgent?.capabilities.map(cap => (
                                                <span key={cap} className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded text-[9px] font-bold uppercase border border-[#D4AF37]/20">{cap}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleTaskExecution}
                            disabled={isProcessing || (!taskInput.trim() && logs.length === 0)}
                            className={`w-full py-8 mt-8 rounded-3xl font-black text-sm tracking-[0.5em] uppercase transition-all flex items-center justify-center gap-4 ${isProcessing ? 'bg-slate-900 text-slate-600' : 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} fill="black" />}
                            {isProcessing ? "NEURAL SYNC IN PROGRESS..." : (logs.length > 0 ? "EXECUTION COMPLETE" : "AUTHORIZE DEPLOYMENT")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
