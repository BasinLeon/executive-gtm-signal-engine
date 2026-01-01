
import React, { useState, useMemo } from 'react';
import { UserState, Contact, AppView } from '../types.ts';
import {
    Users, Plus, Search, Mail, Linkedin, Calendar, MoreHorizontal, Filter, ShieldCheck, Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface NetworkCRMProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const NetworkCRM: React.FC<NetworkCRMProps> = ({ userState, updateUserState, addNotification }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);

    const contacts = userState.contacts || [];

    const filteredContacts = useMemo(() => {
        return contacts.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'ALL' || c.status === filter;
            return matchesSearch && matchesFilter;
        });
    }, [contacts, searchTerm, filter]);

    const generateOutreach = async (contact: Contact) => {
        setIsGeneratingContent(true);
        addNotification('INFO', 'Neural Writer Active', `Drafting high-value outreach for ${contact.name}...`);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const response = await ai.models.generateContent({
                model: 'gemini-2.0-flash-exp',
                contents: `Draft a sovereign, high-status cold email to ${contact.name} (${contact.role} at ${contact.company}).
              Context: ${contact.notes || "No prior context"}.
              My Persona: ${userState.neuralCore.identity}.
              Goal: Secure a 15-min strategic sync.
              Tone: Low friction, high value, peer-to-peer.`
            });

            if (response.text) {
                // In a real app we'd show a modal, for now just log/notify
                console.log(response.text);
                addNotification('SUCCESS', 'Draft Generated', 'Outreach copied to neural buffer (console).');
            }
        } catch (e) {
            addNotification('ERROR', 'Generation Failed', 'Neural writer disconnected.');
        } finally {
            setIsGeneratingContent(false);
        }
    };

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700 overflow-hidden">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">Identity <span className="text-[#00E5FF]">Cloud</span></h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">Network Intelligence // {contacts.length} Nodes Active</p>
                </div>
                <button className="bg-[#00E5FF] hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all">
                    <Plus size={16} /> New Entity
                </button>
            </div>

            <div className="glass-panel p-8 rounded-[3rem] border border-slate-800 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 w-96">
                        <Search className="text-slate-500 ml-2" size={16} />
                        <input
                            className="bg-transparent border-none focus:outline-none text-white text-xs font-mono w-full"
                            placeholder="SEARCH NETWORK NODES..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['ALL', 'WARM', 'COLD', 'CHAMPION'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/50' : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-900'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[9px] text-slate-600 font-mono uppercase tracking-widest border-b border-slate-800">
                                <th className="pb-4 pl-4">Identity</th>
                                <th className="pb-4">Coordinates</th>
                                <th className="pb-4">Last Signal</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 pr-4 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredContacts.map(contact => (
                                <tr key={contact.id} className="group hover:bg-slate-900/30 transition-colors">
                                    <td className="py-6 pl-4">
                                        <div className="font-bold text-white text-sm tracking-tight">{contact.name}</div>
                                        <div className="text-[10px] text-slate-500 font-mono uppercase">{contact.role}</div>
                                    </td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-500 font-black text-[10px]">
                                                {contact.company.charAt(0)}
                                            </div>
                                            {contact.company}
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <div className="text-[10px] text-slate-500 font-mono">
                                            {contact.lastContact || 'NO_DATA'}
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${contact.status === 'CHAMPION' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20' :
                                                contact.status === 'WARM' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                    'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                            {contact.status || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="py-6 pr-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => generateOutreach(contact)} className="p-2 bg-slate-950 rounded hover:text-[#00E5FF] transition-colors border border-slate-800" title="Draft Outreach">
                                                {isGeneratingContent ? <Zap size={14} className="animate-pulse" /> : <Mail size={14} />}
                                            </button>
                                            <button className="p-2 bg-slate-950 rounded hover:text-[#00E5FF] transition-colors border border-slate-800">
                                                <Linkedin size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredContacts.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-700 font-mono text-xs uppercase tracking-widest">
                            <Users size={32} className="mb-4 opacity-20" />
                            No Signals Detected
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
