
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserState, DojoSessionConfig, DossierReport } from '../types.ts';
import { INTERVIEW_STAGES } from '../constants.ts';
import {
    Play, Square, Medal, Target, Clock, BookOpen, Star, ChevronRight,
    CheckCircle2, XCircle, RotateCcw, Sparkles, Brain, MessageSquare,
    TrendingUp, Award, Zap, Timer, ListChecks
} from 'lucide-react';
import { generateDossier } from '../services/geminiService.ts';

interface DojoProps {
    userState: UserState;
    initialConfig?: Partial<DojoSessionConfig>;
    updateUserState: (updates: Partial<UserState>) => void;
    onSessionComplete?: (report: DossierReport, config: DojoSessionConfig) => void;
    addNotification?: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

// Interview Question Bank (50+ questions organized by category)
const QUESTION_BANK = {
    behavioral: [
        { id: 'b1', question: 'Tell me about a time you achieved significant results in a GTM role.', difficulty: 'medium', category: 'Achievement' },
        { id: 'b2', question: 'Describe a situation where you had to influence without direct authority.', difficulty: 'hard', category: 'Leadership' },
        { id: 'b3', question: 'How do you handle situations when you miss a quota or target?', difficulty: 'medium', category: 'Resilience' },
        { id: 'b4', question: 'Tell me about a time you had to pivot your strategy mid-quarter.', difficulty: 'hard', category: 'Adaptability' },
        { id: 'b5', question: 'Describe your approach to building a new market or territory.', difficulty: 'hard', category: 'Strategy' },
        { id: 'b6', question: 'How do you prioritize competing demands from multiple stakeholders?', difficulty: 'medium', category: 'Prioritization' },
        { id: 'b7', question: 'Tell me about a deal you lost. What did you learn?', difficulty: 'medium', category: 'Learning' },
        { id: 'b8', question: 'Describe a time you had to deliver difficult feedback to a team member.', difficulty: 'hard', category: 'Leadership' },
    ],
    strategic: [
        { id: 's1', question: 'How would you structure a go-to-market strategy for a Series B startup?', difficulty: 'hard', category: 'GTM' },
        { id: 's2', question: 'What metrics do you use to measure pipeline health?', difficulty: 'medium', category: 'Metrics' },
        { id: 's3', question: 'How do you think about CAC:LTV ratios in your planning?', difficulty: 'hard', category: 'Unit Economics' },
        { id: 's4', question: 'Describe your ideal sales tech stack and why.', difficulty: 'medium', category: 'Technology' },
        { id: 's5', question: 'How do you balance inbound vs outbound in a hybrid motion?', difficulty: 'medium', category: 'Strategy' },
        { id: 's6', question: 'What is your approach to enterprise vs SMB segmentation?', difficulty: 'hard', category: 'Segmentation' },
        { id: 's7', question: 'How would you diagnose and fix a declining win rate?', difficulty: 'hard', category: 'Diagnostics' },
        { id: 's8', question: 'Describe how you would launch into a new vertical.', difficulty: 'hard', category: 'Expansion' },
    ],
    situational: [
        { id: 'sit1', question: 'Your biggest deal is stalled at legal. How do you unstick it?', difficulty: 'medium', category: 'Negotiation' },
        { id: 'sit2', question: 'A key competitor just undercut your pricing by 40%. What do you do?', difficulty: 'hard', category: 'Competition' },
        { id: 'sit3', question: 'Your top performer just resigned. How do you handle the next 30 days?', difficulty: 'hard', category: 'Crisis' },
        { id: 'sit4', question: 'Finance wants to cut your headcount by 20%. How do you respond?', difficulty: 'hard', category: 'Resource Management' },
        { id: 'sit5', question: 'A customer escalation just hit your CEOs inbox. Walk me through your response.', difficulty: 'medium', category: 'Escalation' },
        { id: 'sit6', question: 'You inherit a team with low morale. What are your first 90 days?', difficulty: 'hard', category: 'Turnaround' },
    ],
    technical: [
        { id: 't1', question: 'Walk me through how you would set up lead scoring.', difficulty: 'medium', category: 'RevOps' },
        { id: 't2', question: 'How do you think about attribution modeling?', difficulty: 'hard', category: 'Analytics' },
        { id: 't3', question: 'Describe your experience with CRM hygiene and data quality.', difficulty: 'medium', category: 'Data' },
        { id: 't4', question: 'How would you implement account-based marketing operationally?', difficulty: 'hard', category: 'ABM' },
        { id: 't5', question: 'What is your approach to sales enablement content?', difficulty: 'medium', category: 'Enablement' },
        { id: 't6', question: 'How do you measure and improve sales velocity?', difficulty: 'medium', category: 'Metrics' },
    ],
    culture: [
        { id: 'c1', question: 'What type of company culture do you thrive in?', difficulty: 'easy', category: 'Fit' },
        { id: 'c2', question: 'How do you build trust with cross-functional partners?', difficulty: 'medium', category: 'Collaboration' },
        { id: 'c3', question: 'Describe your leadership philosophy in 3 sentences.', difficulty: 'medium', category: 'Values' },
        { id: 'c4', question: 'What motivates you beyond compensation?', difficulty: 'easy', category: 'Motivation' },
        { id: 'c5', question: 'How do you handle disagreements with your manager?', difficulty: 'medium', category: 'Communication' },
        { id: 'c6', question: 'What is the most important trait for a GTM leader?', difficulty: 'easy', category: 'Self-Awareness' },
    ],
};

const ALL_QUESTIONS = Object.values(QUESTION_BANK).flat();

type DojoMode = 'LOBBY' | 'PRACTICE' | 'LIVE' | 'STAR_BUILDER' | 'REVIEW';
type AIState = 'OFFLINE' | 'CONNECTING' | 'LISTENING' | 'THINKING' | 'SPEAKING';

export const Dojo: React.FC<DojoProps> = ({ userState, initialConfig, updateUserState, onSessionComplete, addNotification }) => {
    const [mode, setMode] = useState<DojoMode>('LOBBY');
    const [sessionConfig, setSessionConfig] = useState<DojoSessionConfig>({
        mode: 'FRIENDLY',
        stage: INTERVIEW_STAGES[0],
        targetCompany: '',
        targetRole: '',
        ...initialConfig
    });

    // Practice mode state
    const [currentQuestion, setCurrentQuestion] = useState<typeof ALL_QUESTIONS[0] | null>(null);
    const [questionCategory, setQuestionCategory] = useState<string>('behavioral');
    const [practiceTimer, setPracticeTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [starResponse, setStarResponse] = useState({ situation: '', task: '', action: '', result: '' });
    const [completedQuestions, setCompletedQuestions] = useState<string[]>([]);
    const [confidenceRating, setConfidenceRating] = useState(3);

    // Live session state
    const [isActive, setIsActive] = useState(false);
    const [aiState, setAiState] = useState<AIState>('OFFLINE');
    const [dossier, setDossier] = useState<DossierReport | null>(null);
    const [transcript, setTranscript] = useState<{ source: 'AI' | 'YOU'; text: string; timestamp: string }[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [transcript]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => setPracticeTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const selectRandomQuestion = (category: string = questionCategory) => {
        const questions = QUESTION_BANK[category as keyof typeof QUESTION_BANK] || ALL_QUESTIONS;
        const unanswered = questions.filter(q => !completedQuestions.includes(q.id));
        const pool = unanswered.length > 0 ? unanswered : questions;
        const random = pool[Math.floor(Math.random() * pool.length)];
        setCurrentQuestion(random);
        setPracticeTimer(0);
        setIsTimerRunning(true);
        setStarResponse({ situation: '', task: '', action: '', result: '' });
        setConfidenceRating(3);
    };

    const completeQuestion = () => {
        if (currentQuestion) {
            setCompletedQuestions(prev => [...prev, currentQuestion.id]);
            updateUserState({ xp: (userState.xp || 0) + (confidenceRating * 25) });
            addNotification?.('SUCCESS', 'Question Completed!', `+${confidenceRating * 25} XP earned`);
        }
        setIsTimerRunning(false);
        setMode('LOBBY');
    };

    const startSession = async () => {
        setIsActive(true); setAiState('CONNECTING'); setDossier(null); setTranscript([]);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
            setAiState('LISTENING');
            setTimeout(() => {
                setTranscript(p => [...p, {
                    source: 'AI',
                    text: `Welcome to the ${sessionConfig.mode} interview session. I'll be evaluating you for ${sessionConfig.targetRole || 'this position'}${sessionConfig.targetCompany ? ` at ${sessionConfig.targetCompany}` : ''}. Tell me about a time when you achieved significant results in a GTM role.`,
                    timestamp: new Date().toLocaleTimeString()
                }]);
                setAiState('SPEAKING');
            }, 2000);
            setTimeout(() => { setAiState('LISTENING'); }, 15000);
        } catch (err) {
            console.error(err);
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
        if (videoRef.current?.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        const report = await generateDossier(transcript.map(t => t.text).join('\n'));
        setDossier(report);
        updateUserState({ xp: (userState.xp || 0) + 500 });
        addNotification?.('SUCCESS', 'Session Complete', '+500 XP earned');
    };

    // Calculate progress stats
    const progressStats = useMemo(() => ({
        totalQuestions: ALL_QUESTIONS.length,
        completed: completedQuestions.length,
        percentage: Math.round((completedQuestions.length / ALL_QUESTIONS.length) * 100),
        byCategory: Object.keys(QUESTION_BANK).map(cat => ({
            name: cat,
            total: QUESTION_BANK[cat as keyof typeof QUESTION_BANK].length,
            done: QUESTION_BANK[cat as keyof typeof QUESTION_BANK].filter(q => completedQuestions.includes(q.id)).length
        }))
    }), [completedQuestions]);

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6 p-6 lg:p-8 bg-[#020617] relative overflow-hidden animate-in fade-in">
            {/* Left Panel */}
            <div className="w-full lg:w-[420px] flex flex-col gap-4">
                {/* Header */}
                <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                        Tactical <span className="text-[#D4AF37]">Dojo</span>
                    </h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        Interview Preparation System // L22 Confidence
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 transition-all duration-500" style={{ width: `${progressStats.percentage}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-[#D4AF37] font-bold">{progressStats.completed}/{progressStats.totalQuestions}</span>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex gap-2">
                    {[
                        { id: 'LOBBY', icon: <Target size={14} />, label: 'Lobby' },
                        { id: 'PRACTICE', icon: <BookOpen size={14} />, label: 'Practice' },
                        { id: 'STAR_BUILDER', icon: <Star size={14} />, label: 'STAR' },
                        { id: 'LIVE', icon: <Play size={14} />, label: 'Live' },
                    ].map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id as DojoMode)}
                            className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${mode === m.id
                                    ? 'bg-[#D4AF37] text-black'
                                    : 'bg-slate-900 text-slate-500 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {m.icon} {m.label}
                        </button>
                    ))}
                </div>

                {/* Category Progress */}
                <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <ListChecks size={12} /> Question Categories
                    </div>
                    <div className="space-y-2">
                        {progressStats.byCategory.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => { setQuestionCategory(cat.name); setMode('PRACTICE'); selectRandomQuestion(cat.name); }}
                                className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between ${questionCategory === cat.name
                                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30'
                                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <span className="text-[10px] font-bold uppercase text-slate-300 capitalize">{cat.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: `${(cat.done / cat.total) * 100}%` }} />
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-600">{cat.done}/{cat.total}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Panel */}
            <div className="flex-1 glass-panel rounded-[2rem] border border-slate-800 relative overflow-hidden flex flex-col bg-black/40">
                {mode === 'LOBBY' && !dossier && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <Target size={80} className="text-slate-800 mb-6" />
                        <h3 className="text-2xl font-black text-white uppercase mb-2">Ready for Deployment</h3>
                        <p className="text-sm text-slate-500 max-w-md mb-8">
                            Select a practice mode to sharpen your interview skills. Build confidence with structured preparation.
                        </p>
                        <div className="flex gap-4">
                            <button onClick={() => { setMode('PRACTICE'); selectRandomQuestion(); }} className="px-8 py-4 bg-[#D4AF37] text-black font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                                <BookOpen size={16} /> Quick Practice
                            </button>
                            <button onClick={() => setMode('STAR_BUILDER')} className="px-8 py-4 bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                                <Star size={16} /> STAR Builder
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'PRACTICE' && currentQuestion && (
                    <div className="flex-1 flex flex-col p-8">
                        {/* Timer and Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${isTimerRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                    <Timer size={20} />
                                </div>
                                <div>
                                    <div className="text-3xl font-mono font-bold text-white">{formatTime(practiceTimer)}</div>
                                    <div className="text-[9px] text-slate-600 uppercase tracking-wider">Response Time</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase ${currentQuestion.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                        currentQuestion.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>{currentQuestion.difficulty}</span>
                                <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg text-[9px] font-bold uppercase">{currentQuestion.category}</span>
                            </div>
                        </div>

                        {/* Question */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <MessageSquare size={40} className="text-[#D4AF37] mb-6" />
                            <p className="text-2xl font-bold text-white leading-relaxed max-w-3xl">{currentQuestion.question}</p>
                        </div>

                        {/* Confidence Rating */}
                        <div className="mb-6">
                            <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-2 text-center">Confidence Level</div>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setConfidenceRating(level)}
                                        className={`w-12 h-12 rounded-xl font-bold transition-all ${confidenceRating >= level
                                                ? 'bg-[#D4AF37] text-black'
                                                : 'bg-slate-800 text-slate-600 hover:bg-slate-700'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button onClick={() => selectRandomQuestion()} className="flex-1 py-4 bg-slate-800 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-700 flex items-center justify-center gap-2">
                                <RotateCcw size={14} /> Next Question
                            </button>
                            <button onClick={completeQuestion} className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-emerald-500 flex items-center justify-center gap-2">
                                <CheckCircle2 size={14} /> Mark Complete
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'STAR_BUILDER' && (
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
                        <div className="text-center mb-6">
                            <Star size={40} className="text-[#D4AF37] mx-auto mb-3" />
                            <h3 className="text-xl font-black text-white uppercase">STAR Method Builder</h3>
                            <p className="text-[10px] text-slate-500 mt-1">Structure your responses for maximum impact</p>
                        </div>

                        <div className="space-y-4 flex-1">
                            {[
                                { key: 'situation', label: 'Situation', desc: 'Set the scene and context', color: 'cyan' },
                                { key: 'task', label: 'Task', desc: 'What was your responsibility?', color: 'blue' },
                                { key: 'action', label: 'Action', desc: 'What specific steps did you take?', color: 'purple' },
                                { key: 'result', label: 'Result', desc: 'What was the outcome? Quantify it!', color: 'emerald' },
                            ].map(section => (
                                <div key={section.key} className={`p-4 rounded-xl border border-${section.color}-500/30 bg-${section.color}-500/5`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-8 h-8 rounded-lg bg-${section.color}-500/20 flex items-center justify-center text-${section.color}-400 font-black text-sm`}>
                                            {section.label[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white uppercase">{section.label}</div>
                                            <div className="text-[9px] text-slate-500">{section.desc}</div>
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full h-24 bg-black/40 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-[#D4AF37] resize-none"
                                        placeholder={`Enter your ${section.label.toLowerCase()}...`}
                                        value={starResponse[section.key as keyof typeof starResponse]}
                                        onChange={e => setStarResponse(prev => ({ ...prev, [section.key]: e.target.value }))}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                updateUserState({ xp: (userState.xp || 0) + 100 });
                                addNotification?.('SUCCESS', 'STAR Response Saved!', '+100 XP earned');
                                setStarResponse({ situation: '', task: '', action: '', result: '' });
                            }}
                            className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-yellow-500 flex items-center justify-center gap-2 mt-4"
                        >
                            <Sparkles size={16} /> Save Response
                        </button>
                    </div>
                )}

                {mode === 'LIVE' && (
                    <>
                        {isActive ? (
                            <>
                                <video ref={videoRef} className="w-full h-full object-cover opacity-60" autoPlay muted playsInline />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`h-3 w-3 rounded-full ${aiState !== 'OFFLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                            <span className="text-[10px] font-mono uppercase text-slate-400">{aiState}</span>
                                        </div>
                                        <button onClick={stopSession} className="px-6 py-2 bg-red-600 text-white font-black rounded-lg text-[10px] uppercase tracking-widest flex items-center gap-2">
                                            <Square size={12} /> End Session
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : dossier ? (
                            <div className="p-12 flex flex-col items-center justify-center text-center h-full">
                                <Medal size={64} className="text-[#D4AF37] mb-6 animate-bounce" />
                                <h2 className="text-4xl font-black text-white mb-4">Sovereign Dossier</h2>
                                <p className="text-lg text-slate-400 font-mono mb-8 max-w-2xl">{dossier.summary}</p>
                                <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
                                    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Conviction</div>
                                        <div className="text-3xl font-mono text-emerald-400">{dossier.conviction}</div>
                                    </div>
                                    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Clarity</div>
                                        <div className="text-3xl font-mono text-cyan-400">{dossier.clarity}</div>
                                    </div>
                                    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">STAR Index</div>
                                        <div className="text-3xl font-mono text-[#D4AF37]">{dossier.starMethod}</div>
                                    </div>
                                </div>
                                <button onClick={() => { setDossier(null); setMode('LOBBY'); }} className="mt-10 px-10 py-4 bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-700">Return to Lobby</button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <Zap size={60} className="text-[#D4AF37] mb-6" />
                                <h3 className="text-2xl font-black text-white uppercase mb-4">Live Interview Mode</h3>
                                <p className="text-sm text-slate-500 max-w-md mb-8">
                                    Start a simulated interview session with AI-powered responses.
                                </p>
                                <button onClick={startSession} className="px-10 py-4 bg-[#D4AF37] text-black font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2">
                                    <Play size={16} /> Begin Session
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
