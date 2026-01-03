
import React, { useState } from 'react';
import { UserState, NeuralCore } from '../types.ts';
import {
    Save, Fingerprint, Award, BookOpen, Settings, Binary, Cpu, Zap, Map, Hexagon, Network, Eye, Scale, Building, Users, Landmark, Activity, Shield, Terminal, Sparkles, RefreshCw, CheckCircle
} from 'lucide-react';
import { RichTextEditor } from './RichTextEditor.tsx';

interface KnowledgeBaseProps {
    userState: UserState;
    updateUserState: (newState: Partial<UserState>) => void;
    addNotification?: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ userState, updateUserState, addNotification }) => {
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

        await new Promise(r => setTimeout(r, 1500));

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
        addNotification?.('SUCCESS', 'Shard Synthesized', `${currentLayerData.name} enhanced with neural optimization.`);
    };

    // Calculate completion percentage
    const filledLayers = allLayers.filter(l => {
        const val = (core as any)[l.key];
        return val && (Array.isArray(val) ? val.length > 0 : val.toString().trim().length > 0);
    }).length;
    const completionPercent = Math.round((filledLayers / allLayers.length) * 100);

    return (
        <div className="p-8 h-full flex flex-col lg:flex-row gap-8 bg-[#020617] relative overflow-hidden animate-in fade-in duration-700">
            <div className="w-full lg:w-[380px] flex flex-col gap-4 z-10">
                {/* Header with progress */}
                <div className="mb-2">
                    <h2 className="text-4xl font-black text-white leading-none tracking-tighter uppercase">
                        Identity <span className="text-[#D4AF37]">Engine</span>
                    </h2>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 transition-all duration-500"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{completionPercent}%</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-mono mt-2">{filledLayers}/{allLayers.length} shards initialized</p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                    {/* Alpha Layers */}
                    <div className="space-y-2">
                        <h4 className="text-[9px] text-[#D4AF37] font-black uppercase tracking-[0.3em] flex items-center gap-2 sticky top-0 bg-[#020617] py-2">
                            <Zap size={12} className="fill-[#D4AF37]" /> Execution Shards (L0-L10)
                        </h4>
                        {alphaLayers.map(layer => {
                            const hasContent = (core as any)[layer.key]?.toString().trim().length > 0;
                            return (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 text-left group ${activeLayer === layer.id
                                            ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50'
                                            : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-600'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${activeLayer === layer.id ? 'bg-[#D4AF37] text-black' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {layer.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-[10px] font-black uppercase font-mono tracking-wider truncate ${activeLayer === layer.id ? 'text-white' : 'text-slate-500'
                                            }`}>{layer.name}</div>
                                    </div>
                                    {hasContent && (
                                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Omega Layers */}
                    <div className="space-y-2">
                        <h4 className="text-[9px] text-blue-400 font-black uppercase tracking-[0.3em] flex items-center gap-2 sticky top-0 bg-[#020617] py-2">
                            <Network size={12} /> Strategic Peaks (L11-L21)
                        </h4>
                        {omegaLayers.map(layer => {
                            const hasContent = (core as any)[layer.key]?.toString().trim().length > 0;
                            return (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`w-full p-3 rounded-xl border transition-all flex items-center gap-3 text-left group ${activeLayer === layer.id
                                            ? 'bg-blue-500/10 border-blue-500/50'
                                            : 'bg-slate-900/30 border-slate-800/50 hover:border-slate-600'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${activeLayer === layer.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'
                                        }`}>
                                        {layer.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-[10px] font-black uppercase font-mono tracking-wider truncate ${activeLayer === layer.id ? 'text-white' : 'text-slate-500'
                                            }`}>{layer.name}</div>
                                    </div>
                                    {hasContent && (
                                        <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Editor Panel */}
            <div className="flex-1 glass-panel rounded-[2rem] border border-slate-800 flex flex-col relative z-10 overflow-hidden shadow-2xl bg-black/40">
                {/* Header */}
                <div className="p-6 border-b border-slate-800/50 bg-slate-900/20 flex justify-between items-center backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-xl ${activeLayer < 11 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-blue-500/20 text-blue-400'} border border-white/5`}>
                            {currentLayerData ? React.cloneElement(currentLayerData.icon as React.ReactElement<any>, { size: 24 }) : <Binary size={24} />}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white leading-none tracking-tighter uppercase">{currentLayerData?.name}</h3>
                            <p className="text-slate-500 text-[10px] font-mono mt-1 uppercase tracking-widest">{currentLayerData?.desc} // Shard_{activeLayer}</p>
                        </div>
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div className="flex-1 overflow-hidden">
                    <RichTextEditor
                        value={currentLayerData ? ((core as any)[currentLayerData.key]?.toString() || '') : ''}
                        onChange={value => currentLayerData && updateCore(currentLayerData.key, value)}
                        placeholder={`Initialize ${currentLayerData?.name?.toUpperCase()} shard with your professional data...`}
                        onSynthesize={handleSynthesis}
                        isSynthesizing={isSynthesizing}
                    />
                </div>
            </div>
        </div>
    );
};
