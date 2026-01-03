
import React, { useState, useMemo } from 'react';
import { UserState, Contact, AppView } from '../types.ts';
import {
    Users, Plus, Search, Mail, Linkedin, Calendar, MoreHorizontal, Filter, ShieldCheck, Zap, Edit3, Eye
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ContactModal from './ContactModal.tsx';

interface NetworkCRMProps {
    userState: UserState;
    updateUserState: (updates: Partial<UserState>) => void;
    addNotification: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const NetworkCRM: React.FC<NetworkCRMProps> = ({ userState, updateUserState, addNotification }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [isGeneratingContent, setIsGeneratingContent] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    const contacts = userState.contacts || [];

    const filteredContacts = useMemo(() => {
        return contacts.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'ALL' || c.status === filter || c.tier === filter;
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
              Context: ${contact.notes || contact.strategy || "No prior context"}.
              My Persona: ${userState.neuralCore.identity}.
              Goal: Secure a 15-min strategic sync.
              Tone: Low friction, high value, peer-to-peer.`
            });

            if (response.text) {
                console.log(response.text);
                addNotification('SUCCESS', 'Draft Generated', 'Outreach copied to neural buffer (console).');
            }
        } catch (e) {
            addNotification('ERROR', 'Generation Failed', 'Neural writer disconnected.');
        } finally {
            setIsGeneratingContent(false);
        }
    };

    const handleAddNew = () => {
        setSelectedContact(null);
        setModalOpen(true);
    };

    const handleEdit = (contact: Contact) => {
        setSelectedContact(contact);
        setModalOpen(true);
    };

    const handleSave = (contact: Contact) => {
        const existingIndex = contacts.findIndex(c => c.id === contact.id);
        let newContacts: Contact[];

        if (existingIndex >= 0) {
            // Update existing
            newContacts = [...contacts];
            newContacts[existingIndex] = contact;
            addNotification('SUCCESS', 'Contact Updated', `${contact.name} saved successfully.`);
        } else {
            // Add new
            newContacts = [...contacts, contact];
            addNotification('SUCCESS', 'Contact Created', `${contact.name} added to network.`);
        }

        updateUserState({ contacts: newContacts });
    };

    const handleDelete = (id: string) => {
        const contact = contacts.find(c => c.id === id);
        const newContacts = contacts.filter(c => c.id !== id);
        updateUserState({ contacts: newContacts });
        addNotification('INFO', 'Contact Removed', `${contact?.name || 'Contact'} deleted from network.`);
    };

    // Stats
    const activeCount = contacts.filter(c => c.status === 'ACTIVE').length;
    const warmCount = contacts.filter(c => c.status === 'WARM').length;
    const tier1Count = contacts.filter(c => c.tier === '1').length;

    return (
        <div className="p-8 h-full flex flex-col bg-[#020617] relative animate-in fade-in duration-700 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-5xl font-black text-white leading-none tracking-tighter uppercase">Identity <span className="text-[#00E5FF]">Cloud</span></h2>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.5em] mt-3">Network Intelligence // {contacts.length} Nodes Active</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-[#00E5FF] hover:bg-cyan-400 text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all hover:scale-105"
                >
                    <Plus size={16} /> New Entity
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                    <div className="text-2xl font-black text-white">{contacts.length}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Total Nodes</div>
                </div>
                <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl p-4">
                    <div className="text-2xl font-black text-emerald-400">{activeCount}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Active</div>
                </div>
                <div className="bg-yellow-950/30 border border-yellow-800/30 rounded-xl p-4">
                    <div className="text-2xl font-black text-yellow-400">{warmCount}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Warm</div>
                </div>
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-4">
                    <div className="text-2xl font-black text-[#D4AF37]">{tier1Count}</div>
                    <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Tier 1</div>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-[3rem] border border-slate-800 flex-1 flex flex-col overflow-hidden">
                {/* Search & Filters */}
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
                        {['ALL', 'ACTIVE', 'WARM', 'REVIVED', '1', '2', '3'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${filter === f
                                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/50'
                                        : 'bg-transparent text-slate-500 border-transparent hover:bg-slate-900'
                                    }`}
                            >
                                {['1', '2', '3'].includes(f) ? `T${f}` : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[9px] text-slate-600 font-mono uppercase tracking-widest border-b border-slate-800 sticky top-0 bg-[#020617]">
                                <th className="pb-4 pl-4">Identity</th>
                                <th className="pb-4">Coordinates</th>
                                <th className="pb-4">Tier</th>
                                <th className="pb-4">Last Signal</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 pr-4 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredContacts.map(contact => (
                                <tr key={contact.id} className="group hover:bg-slate-900/30 transition-colors cursor-pointer" onClick={() => handleEdit(contact)}>
                                    <td className="py-5 pl-4">
                                        <div className="font-bold text-white text-sm tracking-tight group-hover:text-[#00E5FF] transition-colors">{contact.name}</div>
                                        <div className="text-[10px] text-slate-500 font-mono uppercase">{contact.role}</div>
                                    </td>
                                    <td className="py-5">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-500 font-black text-[10px]">
                                                {contact.company.charAt(0)}
                                            </div>
                                            {contact.company}
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black ${contact.tier === '1' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                                                contact.tier === '2' ? 'bg-slate-700 text-slate-300' :
                                                    'bg-slate-800 text-slate-500'
                                            }`}>
                                            T{contact.tier || '?'}
                                        </span>
                                    </td>
                                    <td className="py-5">
                                        <div className="text-[10px] text-slate-500 font-mono">
                                            {contact.lastTouch || contact.lastContact || 'NO_DATA'}
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${contact.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                contact.status === 'WARM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    contact.status === 'REVIVED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                        contact.status === 'SCHEDULING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                            'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                            {contact.status || 'UNKNOWN'}
                                        </span>
                                    </td>
                                    <td className="py-5 pr-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEdit(contact); }}
                                                className="p-2 bg-slate-950 rounded hover:text-[#00E5FF] transition-colors border border-slate-800"
                                                title="Edit"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); generateOutreach(contact); }}
                                                className="p-2 bg-slate-950 rounded hover:text-[#00E5FF] transition-colors border border-slate-800"
                                                title="Draft Outreach"
                                            >
                                                {isGeneratingContent ? <Zap size={14} className="animate-pulse" /> : <Mail size={14} />}
                                            </button>
                                            <button className="p-2 bg-slate-950 rounded hover:text-[#00E5FF] transition-colors border border-slate-800" title="LinkedIn">
                                                <Linkedin size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State */}
                    {filteredContacts.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-700 font-mono text-xs uppercase tracking-widest">
                            <Users size={32} className="mb-4 opacity-20" />
                            {searchTerm || filter !== 'ALL' ? 'No Matching Contacts' : 'No Contacts Yet'}
                            <button
                                onClick={handleAddNew}
                                className="mt-4 px-4 py-2 bg-[#00E5FF]/10 text-[#00E5FF] rounded-lg text-[10px] hover:bg-[#00E5FF]/20 transition-colors"
                            >
                                + Add First Contact
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Modal */}
            <ContactModal
                isOpen={modalOpen}
                contact={selectedContact}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    );
};
