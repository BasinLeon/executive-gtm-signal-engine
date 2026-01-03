import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, User, Building, Briefcase, Calendar, MessageSquare, Tag, AlertTriangle } from 'lucide-react';
import { Contact } from '../types';

interface ContactModalProps {
    isOpen: boolean;
    contact: Contact | null; // null = new contact
    onClose: () => void;
    onSave: (contact: Contact) => void;
    onDelete: (id: string) => void;
}

const STATUS_OPTIONS = ['ACTIVE', 'WARM', 'COLD', 'REVIVED', 'NURTURE', 'SCHEDULING', 'STALLED', 'CLOSED'];
const TIER_OPTIONS: ('1' | '2' | '3')[] = ['1', '2', '3'];

export const ContactModal: React.FC<ContactModalProps> = ({
    isOpen,
    contact,
    onClose,
    onSave,
    onDelete
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState<Partial<Contact>>({
        name: '',
        company: '',
        role: '',
        status: 'ACTIVE',
        tier: '1',
        lastTouch: new Date().toISOString().split('T')[0],
        strategy: '',
    });

    // Reset form when modal opens or contact changes
    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || '',
                company: contact.company || '',
                role: contact.role || '',
                status: contact.status || 'ACTIVE',
                tier: contact.tier || '1',
                lastTouch: contact.lastTouch || new Date().toISOString().split('T')[0],
                strategy: contact.strategy || '',
                email: contact.email || '',
                linkedin: contact.linkedin || '',
            });
        } else {
            setFormData({
                name: '',
                company: '',
                role: '',
                status: 'ACTIVE',
                tier: '1',
                lastTouch: new Date().toISOString().split('T')[0],
                strategy: '',
            });
        }
        setShowDeleteConfirm(false);
    }, [contact, isOpen]);

    if (!isOpen) return null;

    const isEdit = !!contact;

    const handleSave = () => {
        if (!formData.name || !formData.company) {
            return; // Basic validation
        }

        const savedContact: Contact = {
            id: contact?.id || `c-${Date.now()}`,
            name: formData.name!,
            company: formData.company!,
            role: formData.role || '',
            status: formData.status,
            tier: formData.tier as '1' | '2' | '3',
            lastTouch: formData.lastTouch,
            strategy: formData.strategy,
            email: formData.email,
            linkedin: formData.linkedin,
        };

        onSave(savedContact);
        onClose();
    };

    const handleDelete = () => {
        if (showDeleteConfirm && contact) {
            onDelete(contact.id);
            onClose();
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const inputClass = "w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/20 transition-all";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#00E5FF]/10 rounded-xl">
                            <User className="w-5 h-5 text-[#00E5FF]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {isEdit ? 'Edit Contact' : 'New Contact'}
                            </h2>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                                {isEdit ? `ID: ${contact.id}` : 'Identity Node Creation'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Name & Company Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <User size={12} /> Full Name *
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className={inputClass}
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                <Building size={12} /> Company *
                            </label>
                            <input
                                type="text"
                                placeholder="Acme Corp"
                                className={inputClass}
                                value={formData.company}
                                onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className={labelClass}>
                            <Briefcase size={12} /> Role / Title
                        </label>
                        <input
                            type="text"
                            placeholder="VP of Engineering"
                            className={inputClass}
                            value={formData.role}
                            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        />
                    </div>

                    {/* Status & Tier Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>
                                <Tag size={12} /> Status
                            </label>
                            <select
                                className={inputClass + ' cursor-pointer'}
                                value={formData.status}
                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            >
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s} className="bg-slate-900">{s}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>
                                <Tag size={12} /> Tier
                            </label>
                            <div className="flex gap-2">
                                {TIER_OPTIONS.map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, tier: t }))}
                                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.tier === t
                                                ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/50'
                                                : 'bg-slate-900 text-slate-500 border border-slate-700 hover:bg-slate-800'
                                            }`}
                                    >
                                        T{t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Last Touch */}
                    <div>
                        <label className={labelClass}>
                            <Calendar size={12} /> Last Touch
                        </label>
                        <input
                            type="date"
                            className={inputClass}
                            value={formData.lastTouch}
                            onChange={e => setFormData(prev => ({ ...prev, lastTouch: e.target.value }))}
                        />
                    </div>

                    {/* Strategy/Notes */}
                    <div>
                        <label className={labelClass}>
                            <MessageSquare size={12} /> Strategy / Notes
                        </label>
                        <textarea
                            placeholder="Pitch: 'AI-powered GTM execution'..."
                            className={inputClass + ' min-h-[80px] resize-none'}
                            value={formData.strategy}
                            onChange={e => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                        />
                    </div>

                    {/* Email & LinkedIn */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="email"
                                placeholder="john@acme.com"
                                className={inputClass}
                                value={formData.email || ''}
                                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>LinkedIn</label>
                            <input
                                type="url"
                                placeholder="linkedin.com/in/johndoe"
                                className={inputClass}
                                value={formData.linkedin || ''}
                                onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t border-slate-800 bg-slate-900/50">
                    {isEdit ? (
                        <button
                            onClick={handleDelete}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showDeleteConfirm
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                    : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                                }`}
                        >
                            {showDeleteConfirm ? <AlertTriangle size={14} /> : <Trash2 size={14} />}
                            {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!formData.name || !formData.company}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-[#00E5FF] text-black hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                        >
                            <Save size={14} />
                            {isEdit ? 'Save Changes' : 'Create Contact'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
