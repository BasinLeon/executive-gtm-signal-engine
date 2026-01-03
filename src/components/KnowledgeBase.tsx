
import React, { useState } from 'react';
import { UserState, NeuralCore } from '../types.ts';
import {
    Save, Fingerprint, Award, BookOpen, Settings, Binary, Cpu, Zap, Map, Hexagon, Network, Eye, Scale, Building, Users, Landmark, Activity, Shield, Terminal, Sparkles, RefreshCw
} from 'lucide-react';
// GoogleGenAI removed - using mock synthesis for offline use

interface KnowledgeBaseProps {
    userState: UserState;
    updateUserState: (newState: Partial<UserState>) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ userState, updateUserState }) => {
    const [activeLayer, setActiveLayer] = useState<number>(0);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const core = userState.neuralCore;

    const alphaLayers = [
        { id: 0, icon: <Fingerprint size={16} />, name: "Identity Shard", desc: "Core Bio & DNA", key: 'identity' },
        { id: 1, icon: <Award size={16} />, name: "Victory Ledger", desc: "KPI Proof Points", key: 'ledger' },
        { id: 2, icon: <BookOpen size={16} />, name: "Case Vault", desc: "Narrative Proof", key: 'caseStudies' },
        { id: 3, icon: <Settings size={16} />, name: "GTM Playbook", desc: "Methodologies", key: 'playbooks' },
        { id: 4, icon: <Binary size={16} />, name: "Tech Affinity", desc: "Stack Mastery", key: 'techStack' },
        { id: 5, icon: <Cpu size={16} />, name: "Persona Mapping", desc: "Adaptive Voices", key: 'personas' },
        { id: 6, icon: <Zap size={16} />, name: "Market Thesis", desc: "Industry POV", key: 'marketThesis' },
        { id: 7, icon: <Terminal size={16} />, name: "Narrative Forge", desc: "Content Engine", key: 'narrativeForge' },
        { id: 8, icon: <Activity size={16} />, name: "Asset Library", desc: "Visual Evidence", key: 'assetLibrary' },
        { id: 9, icon: <Binary size={16} />, name: "Neural Intel", desc: "Dojo Data", key: 'dojoIntel' },
        { id: 10, icon: <Map size={16} />, name: "Roadmap", desc: "Trajectory", key: 'roadmap' }
    ];

    const omegaLayers = [
        { id: 11, icon: <Users size={16} />, name: "Cultural Shard", desc: "Alignment Matrix", key: 'culturalAlignment' },
        { id: 12, icon: <Landmark size={16} />, name: "Leadership Phil", desc: "Philosophy Shard", key: 'leadershipPhil' },
        { id: 13, icon: <Activity size={16} />, name: "Rev Engineering", desc: "Architecture Blueprint", key: 'revenueArchitecture' },
        { id: 14, icon: <Network size={16} />, name: "Ecosystem Graph", desc: "Network Intelligence", key: 'ecosystemGraph' },
        { id: 15, icon: <Shield size={16} />, name: "Risk Mitigation", desc: "Strategic Defense", key: 'riskMitigation' },
        { id: 16, icon: <Eye size={16} />, name: "Product Vision", desc: "Convergence Strategy", key: 'productVision' },
        { id: 17, icon: <Users size={16} />, name: "Talent Strategy", desc: "Team Acquisition", key: 'talentStrategy' },
        { id: 18, icon: <Hexagon size={16} />, name: "Category Theory", desc: "Market Creation", key: 'categoryTheory' },
        { id: 19, icon: <Scale size={16} />, name: "Unit Economics", desc: "Mastery Index", key: 'unitEconomics' },
        { id: 20, icon: <Building size={16} />, name: "Board Presence", desc: "Investor Relations", key: 'boardPresence' },
        { id: 21, icon: <Zap size={16} />, name: "Exec Synthesis", desc: "Convergence Peak", key: 'executiveSynthesis' }
    ];

    const allLayers = [...alphaLayers, ...omegaLayers];
    const currentLayerData = allLayers.find(l => l.id === activeLayer);

    const updateCore = (key: string, value: any) => {
        updateUserState({ neuralCore: { ...core, [key]: value } as NeuralCore });
    };

    const handleSynthesis = async () => {
        if (!currentLayerData) return;
        setIsSynthesizing(true);

        // Simulate synthesis delay
        await new Promise(r => setTimeout(r, 1500));

        // Mock synthesis - works without API
        const currentValue = (core as any)[currentLayerData.key] || '';
        const synthesized = currentValue
            ? `[SYNTHESIZED] ${currentValue.trim()}

• Strategic positioning optimized
• Executive gravitas enhanced
• Key differentiators highlighted`
            : `[${currentLayerData.name.toUpperCase()}]

Initialize this shard with your professional data.

Suggested content:
• Key achievements and metrics
• Unique positioning statements
• Evidence-based proof points`;

        updateCore(currentLayerData.key, synthesized);
        setIsSynthesizing(false);
    };

    return (
        <div className="p-8 h-full flex flex-col lg:flex-row gap-8 bg-[#020617] relative overflow-hidden animate-in fade-in duration-700">
            <div className="w-full lg:w-[440px] flex flex-col gap-6 z-10">
                <div className="mb-2">
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">
                        Identity <span className="text-[#D4AF37]">Engine</span>
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6">
                    <div className="space-y-3">
                        <h4 className="text-[10px] text-[#D4AF37] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                            <Zap size={14} className="fill-[#D4AF37]" /> Execution Shards (L0-L10)
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {alphaLayers.map(layer => (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`p-4 rounded-xl border transition-all flex items-center gap-4 text-left group ${activeLayer === layer.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-600'}`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${activeLayer === layer.id ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-500'}`}>
                                        {layer.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-[10px] font-black uppercase font-mono tracking-widest ${activeLayer === layer.id ? 'text-white' : 'text-slate-500'}`}>{layer.name}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                            <Network size={14} className="fill-blue-400" /> Strategic Peaks (L11-L21)
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {omegaLayers.map(layer => (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`p-4 rounded-xl border transition-all flex items-center gap-4 text-left group ${activeLayer === layer.id ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-600'}`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${activeLayer === layer.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                        {layer.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-[10px] font-black uppercase font-mono tracking-widest ${activeLayer === layer.id ? 'text-white' : 'text-slate-500'}`}>{layer.name}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 glass-panel rounded-[3rem] border border-slate-800 flex flex-col relative z-10 overflow-hidden shadow-2xl bg-black/40">
                <div className="p-12 border-b border-slate-800/50 bg-slate-900/20 flex justify-between items-center backdrop-blur-xl">
                    <div className="flex items-center gap-6">
                        <div className={`p-8 rounded-[2rem] ${activeLayer < 11 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-blue-500/20 text-blue-400'} border border-white/5 shadow-2xl transition-all`}>
                            {currentLayerData ? React.cloneElement(currentLayerData.icon as React.ReactElement<any>, { size: 42, strokeWidth: 2.5 }) : <Binary size={42} />}
                        </div>
                        <div>
                            <h3 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">{currentLayerData?.name}</h3>
                            <p className="text-slate-500 text-sm font-mono mt-2 uppercase tracking-[0.3em] font-black italic">{currentLayerData?.desc} // Shard_{activeLayer}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSynthesis}
                        disabled={isSynthesizing}
                        className={`flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isSynthesizing ? 'bg-slate-900 text-slate-600' : 'bg-[#D4AF37] hover:bg-yellow-500 text-black shadow-xl'}`}
                    >
                        {isSynthesizing ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                        {isSynthesizing ? 'Synthesizing...' : 'Neural Synthesis'}
                    </button>
                </div>

                <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-black/20 relative">
                    <div className="absolute inset-0 pointer-events-none opacity-5 geometric-grid"></div>
                    <div className="max-w-5xl mx-auto h-full relative z-10">
                        <div className="flex items-center gap-2 mb-6 text-[10px] text-slate-600 font-mono uppercase tracking-widest font-black">
                            <Terminal size={12} /> Input Buffer (L22 Sovereignty)
                        </div>
                        <textarea
                            className="w-full h-[calc(100%-40px)] bg-transparent text-slate-300 font-mono text-xl leading-relaxed focus:outline-none resize-none placeholder:text-slate-900 selection:bg-[#D4AF37]/30"
                            value={currentLayerData ? (core as any)[currentLayerData.key] : ''}
                            onChange={e => currentLayerData && updateCore(currentLayerData.key, e.target.value)}
                            placeholder={`INITIALIZE ${currentLayerData?.name?.toUpperCase()} SHARD...`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
