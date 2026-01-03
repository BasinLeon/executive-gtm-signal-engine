import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Building, Briefcase, DollarSign, Calendar, MessageSquare, Tag, AlertTriangle, TrendingUp, Percent } from 'lucide-react';
import { JobDeal, JobStage } from '../types';

interface DealModalProps {
    isOpen: boolean;
    deal: JobDeal | null;
    onClose: () => void;
    onSave: (deal: JobDeal) => void;
    onDelete: (id: string) => void;
}

const STAGE_OPTIONS: JobStage[] = [JobStage.TARGET, JobStage.APPLIED, JobStage.INTERVIEWING, JobStage.OFFER, JobStage.CLOSED];
const PRIORITY_OPTIONS: ('P1' | 'P2' | 'P3')[] = ['P1', 'P2', 'P3'];
const INTENT_OPTIONS = ['High', 'Medium', 'Low'];

export const DealModal: React.FC<DealModalProps> = ({
    isOpen,
    deal,
    onClose,
    onSave,
    onDelete
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState<Partial<JobDeal>>({
        company: '',
        role: '',
        stage: JobStage.TARGET,
        probability: 30,
        salary: '',
        value: 0,
        intent: 'Medium',
        priority: 'P1',
        nextStep: '',
        dueDate: '',
        notes: '',
    });

    useEffect(() => {
        if (deal) {
            setFormData({
                company: deal.company || '',
                role: deal.role || '',
                stage: deal.stage || JobStage.TARGET,
                probability: deal.probability || 30,
                salary: deal.salary || '',
                value: deal.value || 0,
                intent: deal.intent || 'Medium',
                priority: deal.priority || 'P1',
                nextStep: deal.nextStep || '',
                dueDate: deal.dueDate || '',
                notes: deal.notes || '',
            });
        } else {
            setFormData({
                company: '',
                role: '',
                stage: JobStage.TARGET,
                probability: 30,
                salary: '',
                value: 0,
                intent: 'Medium',
                priority: 'P1',
                nextStep: '',
                dueDate: new Date().toISOString().split('T')[0],
                notes: '',
            });
        }
        setShowDeleteConfirm(false);
    }, [deal, isOpen]);

    if (!isOpen) return null;

    const isEdit = !!deal;

    const handleSave = () => {
        if (!formData.company || !formData.role) return;

        const savedDeal: JobDeal = {
            id: deal?.id || `j-${Date.now()}`,
            company: formData.company!,
            role: formData.role!,
            stage: formData.stage as JobStage,
            probability: formData.probability || 0,
            salary: formData.salary || '$0',
            value: formData.value || 0,
            intent: formData.intent || 'Medium',
            triggers: deal?.triggers || [],
            lastEnriched: new Date().toISOString().split('T')[0],
            securityProtocol: deal?.securityProtocol || 'Level 3',
            priority: formData.priority as 'P1' | 'P2' | 'P3',
            nextStep: formData.nextStep,
            dueDate: formData.dueDate,
            notes: formData.notes,
            contacts: deal?.contacts || [],
        };

        onSave(savedDeal);
        onClose();
    };

    const handleDelete = () => {
        if (showDeleteConfirm && deal) {
            onDelete(deal.id);
            onClose();
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const inputClass = "w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all";
    const labelClass = "text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2";

    const expectedValue = (formData.value || 0) * ((formData.probability || 0) / 100);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <Briefcase className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {isEdit ? 'Edit Opportunity' : 'New Opportunity'}
                            </h2>
                            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                                {isEdit ? `ID: ${deal.id}` : 'Pipeline Opportunity'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Company & Role */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}><Building size={12} /> Company *</label>
                            <input type="text" placeholder="Acme Corp" className={inputClass}
                                value={formData.company}
                                onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}><Briefcase size={12} /> Role *</label>
                            <input type="text" placeholder="Director of GTM" className={inputClass}
                                value={formData.role}
                                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Stage */}
                    <div>
                        <label className={labelClass}><TrendingUp size={12} /> Stage</label>
                        <div className="flex gap-2">
                            {STAGE_OPTIONS.map(s => (
                                <button key={s} type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, stage: s }))}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] uppercase transition-all ${formData.stage === s
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                            : 'bg-slate-900 text-slate-500 border border-slate-700 hover:bg-slate-800'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority & Probability */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}><Tag size={12} /> Priority</label>
                            <div className="flex gap-2">
                                {PRIORITY_OPTIONS.map(p => (
                                    <button key={p} type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.priority === p
                                                ? p === 'P1' ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                                    : p === 'P2' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                                                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/50'
                                                : 'bg-slate-900 text-slate-500 border border-slate-700 hover:bg-slate-800'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}><Percent size={12} /> Probability</label>
                            <div className="flex items-center gap-3">
                                <input type="range" min="0" max="100" step="10"
                                    className="flex-1 accent-emerald-500"
                                    value={formData.probability}
                                    onChange={e => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) }))}
                                />
                                <span className="text-emerald-400 font-bold text-lg w-12 text-right">{formData.probability}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Salary & Value */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}><DollarSign size={12} /> Salary/Rate</label>
                            <input type="text" placeholder="$220k" className={inputClass}
                                value={formData.salary}
                                onChange={e => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}><DollarSign size={12} /> Annual Value</label>
                            <input type="number" placeholder="220000" className={inputClass}
                                value={formData.value}
                                onChange={e => setFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                            />
                        </div>
                    </div>

                    {/* Expected Value Display */}
                    <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500">Expected Value</span>
                        <span className="text-xl font-black text-emerald-400">${expectedValue.toLocaleString()}</span>
                    </div>

                    {/* Next Step & Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}><MessageSquare size={12} /> Next Step</label>
                            <input type="text" placeholder="Schedule Interview" className={inputClass}
                                value={formData.nextStep}
                                onChange={e => setFormData(prev => ({ ...prev, nextStep: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}><Calendar size={12} /> Due Date</label>
                            <input type="date" className={inputClass}
                                value={formData.dueDate}
                                onChange={e => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className={labelClass}><MessageSquare size={12} /> Notes</label>
                        <textarea placeholder="Interview notes, context..."
                            className={inputClass + ' min-h-[80px] resize-none'}
                            value={formData.notes}
                            onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t border-slate-800 bg-slate-900/50">
                    {isEdit ? (
                        <button onClick={handleDelete}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showDeleteConfirm
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                    : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                                }`}
                        >
                            {showDeleteConfirm ? <AlertTriangle size={14} /> : <Trash2 size={14} />}
                            {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                        </button>
                    ) : <div />}

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 transition-all">
                            Cancel
                        </button>
                        <button onClick={handleSave} disabled={!formData.company || !formData.role}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-black hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        >
                            <Save size={14} />
                            {isEdit ? 'Save Changes' : 'Create Deal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealModal;
