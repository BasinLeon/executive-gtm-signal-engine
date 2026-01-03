
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { Dojo } from './components/Dojo.tsx';
import { PipelineTracker } from './components/PipelineTracker.tsx';
import { NetworkCRM } from './components/NetworkCRM.tsx';
import { KnowledgeBase } from './components/KnowledgeBase.tsx';
import { AgentHub } from './components/AgentHub.tsx';
import { VisionaryStudio } from './components/VisionaryStudio.tsx';
import SignalBrief from './components/SignalBrief.tsx';
import { SettingsPanel } from './components/SettingsPanel.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';

import { AppView, UserState, JobDeal, Contact } from './types.ts';
import { INITIAL_STATE } from './constants.ts';
import { parseBulkImportData } from './services/geminiService.ts';

const App: React.FC = () => {
    const [view, setView] = useState<AppView>(AppView.DASHBOARD);
    const [userState, setUserState] = useState<UserState>(() => {
        const saved = localStorage.getItem('nexus_state_v9_sovereign_5');
        return saved ? JSON.parse(saved) : INITIAL_STATE;
    });
    const [notifications, setNotifications] = useState<{ id: number, type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', title: string, sub?: string }[]>([]);
    const [focusedItemId, setFocusedItemId] = useState<string | undefined>();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

    // Save state to localStorage
    useEffect(() => {
        localStorage.setItem('nexus_state_v9_sovereign_5', JSON.stringify(userState));
    }, [userState]);

    // Global Cmd+K listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setCommandPaletteOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const addNotification = (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', title: string, sub?: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev.slice(-4), { id, type, title, sub }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
    };

    const handleQuantumSelect = (result: { id: string, type: string, view: AppView }) => {
        setView(result.view);
        setFocusedItemId(result.id);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const content = evt.target?.result as string;
            try {
                // Try parsing as full backup first
                const parsed = JSON.parse(content);
                if (parsed.contacts && parsed.pipeline) {
                    setUserState(parsed as UserState);
                    addNotification('SUCCESS', 'Full Backup Restored', `Loaded ${parsed.contacts.length} contacts and ${parsed.pipeline.length} deals.`);
                    return;
                }
            } catch {
                // Fall back to AI parsing for CSV/text
            }
            const data = await parseBulkImportData(content);
            setUserState(prev => ({
                ...prev,
                contacts: [...prev.contacts, ...data.contacts.map((c: any) => ({ ...c, id: `imp-${Date.now()}-${Math.random()}` } as Contact))],
                pipeline: [...prev.pipeline, ...data.deals.map((d: any) => ({ ...d, id: `imp-${Date.now()}-${Math.random()}` } as JobDeal))]
            }));
            addNotification('SUCCESS', 'Data Vault Ingestion', `Imported ${data.contacts.length} identities and ${data.deals.length} opportunities.`);
        };
        reader.readAsText(file);
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(userState, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexus_core_backup_${new Date().toISOString()}.json`;
        a.click();
        addNotification('SUCCESS', 'Backup Created', 'Full state exported to JSON file.');
    };

    const handleReset = () => {
        localStorage.removeItem('nexus_state_v9_sovereign_5');
        setUserState(INITIAL_STATE);
        addNotification('INFO', 'System Reset', 'All data restored to default state.');
    };

    // Check if we're on the /brief route for PDF generation
    if (window.location.pathname === '/brief') {
        return <SignalBrief />;
    }

    return (
        <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans selection:bg-[#D4AF37]/30">
            <Sidebar
                currentView={view}
                setView={setView}
                userState={userState}
                onQuantumSelect={handleQuantumSelect}
                onExportData={handleExport}
                onImportData={handleImport}
                onOpenSettings={() => setSettingsOpen(true)}
            />

            <main className="flex-1 relative overflow-hidden">
                {/* Notifications */}
                <div className="absolute top-0 right-0 p-8 flex flex-col gap-4 z-50 pointer-events-none">
                    {notifications.map(n => (
                        <div key={n.id} className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-2xl min-w-[300px] animate-in slide-in-from-right fade-in duration-300 ${n.type === 'SUCCESS' ? 'bg-emerald-900/40 border-emerald-500/50' : n.type === 'ERROR' ? 'bg-red-900/40 border-red-500/50' : 'bg-slate-900/80 border-[#D4AF37]/40'}`}>
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${n.type === 'SUCCESS' ? 'text-emerald-400' : n.type === 'ERROR' ? 'text-red-400' : 'text-[#D4AF37]'}`}>{n.type} LOG</div>
                            <div className="font-bold text-sm tracking-tight">{n.title}</div>
                            {n.sub && <div className="text-xs text-slate-400 font-mono mt-1">{n.sub}</div>}
                        </div>
                    ))}
                </div>

                {/* Cmd+K Hint */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40">
                    <button
                        onClick={() => setCommandPaletteOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-full text-xs text-slate-400 transition-all backdrop-blur-sm hover:scale-105"
                    >
                        <span>Search...</span>
                        <kbd className="px-1.5 py-0.5 bg-slate-900 rounded text-slate-500 border border-slate-600">⌘K</kbd>
                    </button>
                </div>

                {view === AppView.DASHBOARD && <Dashboard
                    userState={userState}
                    setView={setView}
                    updateUserState={update}
                    onPrepJob={() => { }}
                    onSimulateCall={() => { }}
                    addNotification={addNotification}
                />}

                {view === AppView.DOJO && <Dojo
                    userState={userState}
                    updateUserState={update}
                    initialConfig={{}}
                />}

                {view === AppView.NETWORK && <NetworkCRM
                    userState={userState}
                    updateUserState={update}
                    addNotification={addNotification}
                />}

                {view === AppView.PIPELINE && <PipelineTracker
                    userState={userState}
                    updateUserState={update}
                    addNotification={addNotification}
                    focusedDealId={focusedItemId}
                />}

                {view === AppView.KNOWLEDGE && <KnowledgeBase
                    userState={userState}
                    updateUserState={update}
                />}

                {view === AppView.AGENTS && <AgentHub
                    userState={userState}
                    updateUserState={update}
                    addNotification={addNotification}
                />}

                {view === AppView.MEDIA_OPS && <VisionaryStudio
                    userState={userState}
                    updateUserState={update}
                />}
            </main>

            {/* Settings Panel */}
            <SettingsPanel
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                onResetData={handleReset}
                onExportData={handleExport}
                onImportData={handleImport}
            />

            {/* Command Palette */}
            <CommandPalette
                isOpen={commandPaletteOpen}
                onClose={() => setCommandPaletteOpen(false)}
                contacts={userState.contacts}
                pipeline={userState.pipeline}
                onNavigate={setView}
                onSelectContact={(id) => setFocusedItemId(id)}
                onSelectDeal={(id) => setFocusedItemId(id)}
            />
        </div>
    );

    function update(newState: Partial<UserState>) {
        setUserState(prev => ({ ...prev, ...newState }));
    }
};

export default App;
