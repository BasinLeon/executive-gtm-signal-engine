
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserState, DojoSessionConfig, DossierReport } from '../types.ts';
import { INTERVIEW_STAGES } from '../constants.ts';
import {
    Play, Square, Medal, Target
} from 'lucide-react';
// GoogleGenAI removed - using mock interview mode for offline use
import { generateDossier } from '../services/geminiService.ts';

interface DojoProps {
    userState: UserState;
    initialConfig?: Partial<DojoSessionConfig>;
    updateUserState: (updates: Partial<UserState>) => void;
    onSessionComplete?: (report: DossierReport, config: DojoSessionConfig) => void;
}

const VOICE_MAP: Record<string, string> = {
    'FRIENDLY': 'Kore',
    'SKEPTIC': 'Puck',
    'BRUTAL': 'Fenrir',
    'RIDDLER': 'Charon'
};

type AIState = 'OFFLINE' | 'CONNECTING' | 'LISTENING' | 'THINKING' | 'SPEAKING';

export const Dojo: React.FC<DojoProps> = ({ userState, initialConfig, updateUserState, onSessionComplete }) => {
    const [sessionConfig, setSessionConfig] = useState<DojoSessionConfig>({
        mode: 'FRIENDLY',
        stage: INTERVIEW_STAGES[0],
        targetCompany: '',
        targetRole: '',
        ...initialConfig
    });

    const [isActive, setIsActive] = useState(false);
    const [aiState, setAiState] = useState<AIState>('OFFLINE');
    const [isMuted, setIsMuted] = useState(false);
    const [dossier, setDossier] = useState<DossierReport | null>(null);
    const [transcript, setTranscript] = useState<{ source: 'AI' | 'YOU'; text: string; timestamp: string }[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const liveSessionRef = useRef<any>(null);
    const nextAudioStartTimeRef = useRef<number>(0);
    const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);
    const interruptionCountRef = useRef(0);
    const audioProcessingChain = useRef<Promise<void>>(Promise.resolve());
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [transcript]);

    const startSession = async () => {
        setIsActive(true); setAiState('CONNECTING'); setDossier(null); setTranscript([]);

        try {
            // Try to get camera for visual feedback
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }

            // Mock interview mode - works without API
            setAiState('LISTENING');

            // Simulate AI greeting after short delay
            setTimeout(() => {
                setTranscript(p => [...p, {
                    source: 'AI',
                    text: `Welcome to the ${sessionConfig.mode} interview session. I'll be evaluating you for ${sessionConfig.targetRole || 'this position'}${sessionConfig.targetCompany ? ` at ${sessionConfig.targetCompany}` : ''}. Tell me about a time when you achieved significant results in a GTM role.`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
                setAiState('SPEAKING');
            }, 2000);

            // Simulate follow-up questions
            setTimeout(() => {
                setAiState('LISTENING');
                setTranscript(p => [...p, {
                    source: 'AI',
                    text: `Interesting. How did you measure success in that situation?`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            }, 15000);

            setTimeout(() => {
                setTranscript(p => [...p, {
                    source: 'AI',
                    text: `Can you walk me through your decision-making process when facing a strategic challenge?`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
            }, 30000);

        } catch (err) {
            console.error(err);
            // Still allow session without camera
            setAiState('LISTENING');
            setTranscript([{
                source: 'AI',
                text: `[Demo Mode] Camera unavailable. This is a simulated interview. In production, you would have a live AI conversation here.`,
                timestamp: new Date().toLocaleTimeString()
            }]);
        }
    };

    const stopSession = async () => {
        setIsActive(false); setAiState('OFFLINE');
        if (liveSessionRef.current) liveSessionRef.current.close();
        if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());

        const report = await generateDossier(transcript.map(t => t.text).join('\n'));
        setDossier(report);
        updateUserState({ xp: userState.xp + 500 });
    };

    return (
        <div className="h-full flex gap-8 p-8 bg-[#020617] relative overflow-hidden animate-in fade-in">
            <div className="w-[480px] flex flex-col gap-6">
                <div className="glass-panel p-8 rounded-[2rem] border border-slate-800 flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Tactical Dojo</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                        {transcript.map((t, i) => (
                            <div key={i} className={`p-4 rounded-xl text-xs font-mono leading-relaxed ${t.source === 'YOU' ? 'bg-slate-900 text-slate-400 border-l-2 border-cyan-500 ml-4' : 'bg-[#D4AF37]/10 text-white border-l-2 border-[#D4AF37] mr-4'}`}>
                                <div className="text-[8px] font-black uppercase mb-1 opacity-50">{t.source} // {t.timestamp}</div>
                                {t.text}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${aiState !== 'OFFLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] font-mono uppercase text-slate-500">{aiState}</span>
                        </div>
                        {!isActive ? (
                            <button onClick={startSession} className="px-8 py-3 bg-[#D4AF37] text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                                <Play size={14} /> Enter Dojo
                            </button>
                        ) : (
                            <button onClick={stopSession} className="px-8 py-3 bg-red-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
                                <Square size={14} /> Exit Session
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-1 glass-panel rounded-[3rem] border border-slate-800 relative overflow-hidden flex flex-col bg-black">
                {isActive ? (
                    <video ref={videoRef} className="w-full h-full object-cover opacity-60" autoPlay muted playsInline />
                ) : dossier ? (
                    <div className="p-20 flex flex-col items-center justify-center text-center h-full">
                        <Medal size={84} className="text-[#D4AF37] mb-8 animate-bounce" />
                        <h2 className="text-6xl font-black text-white mb-4">Sovereign Dossier</h2>
                        <p className="text-xl text-slate-400 font-mono mb-12 max-w-2xl">{dossier.summary}</p>
                        <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
                            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Conviction</div>
                                <div className="text-4xl font-mono text-emerald-400">{dossier.conviction}</div>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Clarity</div>
                                <div className="text-4xl font-mono text-cyan-400">{dossier.clarity}</div>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800">
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">STAR Index</div>
                                <div className="text-4xl font-mono text-[#D4AF37]">{dossier.starMethod}</div>
                            </div>
                        </div>
                        <button onClick={() => setDossier(null)} className="mt-16 px-12 py-5 bg-slate-800 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:bg-slate-700 transition-colors">Return to Lobby</button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-800 opacity-20">
                        <Target size={120} className="mb-6" />
                        <span className="font-mono text-sm tracking-[1em] uppercase">Ready for Deployment</span>
                    </div>
                )}
            </div>
        </div>
    );
};
