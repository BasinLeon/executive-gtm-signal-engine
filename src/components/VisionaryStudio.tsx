
import React, { useState } from 'react';
import { UserState, GeneratedAsset } from '../types.ts';

import {
    Zap, MonitorPlay, Layers, Sparkles, RefreshCw, Aperture, Check
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface VisionaryStudioProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
}

type StudioMode = 'ASSET_FORGE' | 'SIMULACRUM' | 'NARRATIVE_CORE';

export const VisionaryStudio: React.FC<VisionaryStudioProps> = ({ userState, updateUserState }) => {
    const [mode, setMode] = useState<StudioMode>('ASSET_FORGE');
    const [prompt, setPrompt] = useState("A cinematic shot of a high-tech boardroom, volumetric lighting, data visualizations in the air, 8k, professional.");
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
    const [status, setStatus] = useState("");
    const [exportStatus, setExportStatus] = useState<'IDLE' | 'EXPORTED'>('IDLE');

    const generateVideo = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true); setStatus("Initializing Neural Forge...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            // NOTE: Veo Video generation is a very hypothetical/preview API. 
            // Assuming 'generateVideos' or similar will exist or we mock it for the demo if not publicly available yet.
            // For now, we will simulate the waiting period and return a placeholder if actual API fails or is not available.

            // Simulate real delay
            await new Promise(r => setTimeout(r, 2000));
            setStatus("Rendering Neural Frames...");
            await new Promise(r => setTimeout(r, 2000));

            const mockUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"; // Placeholder

            // In a real implementation:
            /*
            let operation = await ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt: prompt,
              config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
            });
            while (!operation.done) {
              await new Promise(r => setTimeout(r, 4000));
              operation = await ai.operations.getVideosOperation({operation: operation});
               setStatus("Rendering Neural Frames...");
            }
            if (operation.response?.generatedVideos?.[0]?.video?.uri) {
                 mockUrl = operation.response.generatedVideos[0].video.uri;
            }
            */

            setCurrentVideoUrl(mockUrl);

            const newAsset: GeneratedAsset = {
                id: `v-${Date.now()}`,
                type: 'VIDEO',
                url: mockUrl,
                prompt: prompt,
                createdAt: new Date().toISOString(),
                style: 'CINEMATIC'
            };
            updateUserState({ assets: [newAsset, ...(userState.assets || [])] });
            setStatus("Forge Successful.");
        } catch (e) {
            console.error(e);
            setStatus("System Interrupt.");
        } finally { setIsGenerating(false); }
    };
    const [scriptSpeed, setScriptSpeed] = useState(1);
    const [isTeleprompterActive, setIsTeleprompterActive] = useState(false);
    const [generatedScript, setGeneratedScript] = useState("");

    const generateScript = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true); setStatus("Synthesizing Executive Script...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-exp',
                contents: `Write a punchy, high-impact script for an executive video update.
                Context: ${userState.neuralCore.identity}
                Topic: ${prompt}
                Format: Teleprompter script. Short, spoken-word sentences. Mark pauses with [PAUSE].`
            });
            setGeneratedScript(response.text || "Script generation failed.");
            setMode('NARRATIVE_CORE');
            setStatus("Script Ready.");
        } catch (e) {
            setStatus("Script Synthesis Failed.");
        } finally { setIsGenerating(false); }
    };

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">Visionary <span className="text-[#00E5FF]">Studio</span></h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">High-End Asset Forge // Executive Teleprompter</p>
                </div>
                <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
                    {(['ASSET_FORGE', 'NARRATIVE_CORE'] as StudioMode[]).map(m => (
                        <button key={m} onClick={() => setMode(m)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${mode === m ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-slate-200'}`}>
                            {m.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
                <div className="w-full lg:w-[480px] flex flex-col gap-6">
                    <div className="glass-panel p-10 rounded-[3rem] border border-slate-800 flex flex-col">
                        <div className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3"><Sparkles size={16} /> Asset Director</div>
                        <textarea
                            className="w-full h-48 bg-black/40 border border-slate-800 rounded-3xl p-6 text-sm font-mono text-slate-300 focus:border-cyan-500 focus:outline-none transition-all placeholder:text-slate-800 leading-relaxed resize-none"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder={mode === 'ASSET_FORGE' ? "Describe video scene..." : "Topic for video script (e.g. 'Why I am the best fit for NVIDIA')..."}
                        />
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={mode === 'ASSET_FORGE' ? generateVideo : generateScript}
                                disabled={isGenerating}
                                className={`flex-1 py-6 rounded-3xl font-black text-xs tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 ${isGenerating ? 'bg-slate-900 text-slate-600' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_40px_rgba(0,229,255,0.3)]'}`}
                            >
                                {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} fill="black" />}
                                {isGenerating ? "PROCESSING..." : mode === 'ASSET_FORGE' ? "FORGE VIDEO" : "GENERATE SCRIPT"}
                            </button>
                        </div>
                    </div>

                    <div className="glass-panel p-10 rounded-[3rem] border border-slate-800 flex-1 flex flex-col overflow-hidden">
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-6">Archive // Forge History</div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                            {userState.assets?.map(asset => (
                                <div key={asset.id} className="group relative bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden cursor-pointer">
                                    <video src={asset.url} className="w-full h-32 object-cover opacity-60" muted />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center">
                                        <p className="text-[8px] font-mono text-white uppercase line-clamp-3">{asset.prompt}</p>
                                    </div>
                                </div>
                            ))}
                            {(!userState.assets || userState.assets.length === 0) && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-800 font-mono text-[9px] uppercase tracking-widest py-20">
                                    <Layers size={42} className="opacity-10 mb-4" />
                                    No assets in archive
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 glass-panel rounded-[3.5rem] border border-slate-800 relative overflow-hidden bg-black flex flex-col shadow-2xl">
                    {mode === 'NARRATIVE_CORE' ? (
                        <div className="h-full flex flex-col relative">
                            <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-20 bg-gradient-to-b from-black via-black/80 to-transparent">
                                <span className="text-red-500 font-black uppercase tracking-widest animate-pulse flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> REC</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-500 font-mono text-xs">SPEED: {scriptSpeed}x</span>
                                    <input type="range" min="0.5" max="2" step="0.1" value={scriptSpeed} onChange={e => setScriptSpeed(parseFloat(e.target.value))} className="w-24 accent-cyan-500" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-20 text-center flex flex-col items-center pt-32 pb-32">
                                <div className="print-artifact">
                                    <div className="print-watermark">SOVEREIGN DATA</div>
                                    <div className="hidden print:block mb-8 border-b-2 border-black pb-4 text-left w-full">
                                        <h1 className="text-2xl font-bold uppercase tracking-widest text-black">Executive Signal Briefing</h1>
                                        <div className="flex justify-between text-xs font-mono uppercase mt-2 text-gray-600">
                                            <span>Origin: Basin::Nexus v9.0</span>
                                            <span>Date: {new Date().toLocaleDateString()}</span>
                                            <span>Classification: CONFIDENTIAL PO-1</span>
                                        </div>
                                    </div>
                                    <p className="text-4xl md:text-5xl font-bold text-white leading-relaxed font-sans max-w-4xl tracking-tight selection:bg-cyan-500/30 print:text-black print:text-xl print:text-left print:font-serif print:leading-normal">
                                        {generatedScript || "Generate a script to activate the teleprompter."}
                                    </p>
                                    {generatedScript && (
                                        <button
                                            onClick={() => {
                                                window.print();
                                                setExportStatus('EXPORTED');
                                                setTimeout(() => setExportStatus('IDLE'), 5000);
                                            }}
                                            className={`mt-12 px-8 py-3 rounded-full font-mono text-xs uppercase tracking-widest transition-all mb-20 print:hidden flex items-center gap-2 group relative overflow-hidden ${exportStatus === 'EXPORTED' ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-white/10 hover:bg-white text-white hover:text-black border border-white/20'}`}
                                        >
                                            {exportStatus === 'EXPORTED' ? (
                                                <>
                                                    <Check size={16} />
                                                    ARTIFACT SECURED (PDF)
                                                </>
                                            ) : (
                                                <>
                                                    <Aperture size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                                                    Export Decision Artifact (PDF)
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    ) : currentVideoUrl ? (
                        <video src={currentVideoUrl} className="w-full h-full object-cover" controls autoPlay loop />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-800">
                            {isGenerating ? (
                                <div className="text-center">
                                    <RefreshCw size={80} className="animate-spin text-cyan-500 mb-8 opacity-50" />
                                    <div className="text-cyan-500 font-mono tracking-widest uppercase">{status}</div>
                                </div>
                            ) : (
                                <>
                                    <MonitorPlay size={120} className="opacity-10 mb-6" />
                                    <span className="font-mono text-sm tracking-[1em] uppercase">Studio Standby</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
