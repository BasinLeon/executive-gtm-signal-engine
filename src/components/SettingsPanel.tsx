import { useState } from 'react';
import { Settings, Trash2, Download, Upload, RefreshCw, X, Check, AlertTriangle } from 'lucide-react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onResetData: () => void;
    onExportData: () => void;
    onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    onResetData,
    onExportData,
    onImportData
}) => {
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    if (!isOpen) return null;

    const handleReset = () => {
        if (showResetConfirm) {
            onResetData();
            setShowResetConfirm(false);
            onClose();
        } else {
            setShowResetConfirm(true);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                            <Settings className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                        <h2 className="text-lg font-bold text-white">System Settings</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Data Management Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Data Management
                        </h3>

                        {/* Export */}
                        <button
                            onClick={onExportData}
                            className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors group"
                        >
                            <Download className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                                <div className="text-sm font-medium text-white">Export Backup</div>
                                <div className="text-xs text-slate-500">Download all data as JSON</div>
                            </div>
                        </button>

                        {/* Import */}
                        <label className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer group">
                            <Upload className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                                <div className="text-sm font-medium text-white">Import Data</div>
                                <div className="text-xs text-slate-500">Load from JSON backup</div>
                            </div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={onImportData}
                                className="hidden"
                            />
                        </label>

                        {/* Reset */}
                        <button
                            onClick={handleReset}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${showResetConfirm
                                    ? 'bg-red-500/20 border border-red-500/50'
                                    : 'bg-slate-800 hover:bg-slate-700'
                                }`}
                        >
                            {showResetConfirm ? (
                                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                            ) : (
                                <RefreshCw className="w-5 h-5 text-orange-400 group-hover:rotate-180 transition-transform" />
                            )}
                            <div className="text-left flex-1">
                                <div className={`text-sm font-medium ${showResetConfirm ? 'text-red-400' : 'text-white'}`}>
                                    {showResetConfirm ? 'Click Again to Confirm Reset' : 'Reset to Default Data'}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {showResetConfirm ? 'This action cannot be undone!' : 'Clear all custom data'}
                                </div>
                            </div>
                            {showResetConfirm && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowResetConfirm(false);
                                    }}
                                    className="p-1 hover:bg-slate-700 rounded"
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            )}
                        </button>
                    </div>

                    {/* App Info */}
                    <div className="pt-4 border-t border-slate-700">
                        <div className="text-center text-xs text-slate-600">
                            <span className="text-[#D4AF37]">BASIN::NEXUS</span> v9.0 | Sovereign Edition
                        </div>
                        <div className="text-center text-xs text-slate-700 mt-1">
                            Built by Leon Basin · Jan 2026
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
