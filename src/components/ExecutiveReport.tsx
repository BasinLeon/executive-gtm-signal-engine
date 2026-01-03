import React, { useState, useMemo } from 'react';
import { UserState, JobStage } from '../types.ts';
import {
    FileText, Download, Briefcase, Users, TrendingUp, Target,
    Calendar, CheckCircle2, Clock, DollarSign, Award, Zap
} from 'lucide-react';

interface ExecutiveReportProps {
    userState: UserState;
    addNotification?: (type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING', msg: string, sub?: string) => void;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ userState, addNotification }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const reportData = useMemo(() => {
        const pipeline = userState.pipeline || [];
        const contacts = userState.contacts || [];

        const totalValue = pipeline.reduce((acc, d) => acc + (d.value || 0), 0);
        const weightedValue = pipeline.reduce((acc, d) => acc + ((d.value || 0) * (d.probability / 100)), 0);

        const stageBreakdown = {
            target: pipeline.filter(d => d.stage === JobStage.TARGET),
            applied: pipeline.filter(d => d.stage === JobStage.APPLIED),
            interview: pipeline.filter(d => d.stage === JobStage.INTERVIEWING),
            offer: pipeline.filter(d => d.stage === JobStage.OFFER),
            closed: pipeline.filter(d => d.stage === JobStage.CLOSED),
        };

        const tier1Contacts = contacts.filter(c => c.tier === '1');
        const activeContacts = contacts.filter(c => c.status === 'ACTIVE');

        return {
            totalValue,
            weightedValue,
            averageProb: pipeline.length > 0 ? Math.round(pipeline.reduce((a, d) => a + d.probability, 0) / pipeline.length) : 0,
            totalDeals: pipeline.length,
            stageBreakdown,
            topDeals: pipeline.sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5),
            totalContacts: contacts.length,
            tier1Count: tier1Contacts.length,
            activeCount: activeContacts.length,
            xp: userState.xp || 0,
            streak: userState.streak || 0,
        };
    }, [userState]);

    const generatePDF = async () => {
        setIsGenerating(true);

        // Simulate PDF generation
        await new Promise(r => setTimeout(r, 2000));

        // Create printable content
        const printContent = `
            <html>
            <head>
                <title>BASIN::NEXUS Executive Report</title>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1a1a1a; }
                    h1 { font-size: 28px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
                    h2 { font-size: 18px; margin-top: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 5px; color: #D4AF37; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                    .date { font-size: 12px; color: #666; }
                    .metric { display: inline-block; margin-right: 30px; margin-bottom: 20px; }
                    .metric-value { font-size: 32px; font-weight: bold; }
                    .metric-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
                    th { font-size: 10px; text-transform: uppercase; color: #888; letter-spacing: 1px; }
                    .footer { margin-top: 50px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>Executive Briefing</h1>
                        <div class="date">BASIN::NEXUS v9.0 Sovereign Edition</div>
                    </div>
                    <div class="date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                
                <h2>Pipeline Summary</h2>
                <div class="metric">
                    <div class="metric-value">$${(reportData.totalValue / 1000000).toFixed(2)}M</div>
                    <div class="metric-label">Total Pipeline Value</div>
                </div>
                <div class="metric">
                    <div class="metric-value">$${(reportData.weightedValue / 1000).toFixed(0)}K</div>
                    <div class="metric-label">Weighted Forecast</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${reportData.averageProb}%</div>
                    <div class="metric-label">Avg. Probability</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${reportData.totalDeals}</div>
                    <div class="metric-label">Active Opportunities</div>
                </div>
                
                <h2>Stage Distribution</h2>
                <table>
                    <tr><th>Stage</th><th>Count</th><th>Value</th></tr>
                    <tr><td>Target</td><td>${reportData.stageBreakdown.target.length}</td><td>$${(reportData.stageBreakdown.target.reduce((a, d) => a + (d.value || 0), 0) / 1000).toFixed(0)}K</td></tr>
                    <tr><td>Engaged</td><td>${reportData.stageBreakdown.applied.length}</td><td>$${(reportData.stageBreakdown.applied.reduce((a, d) => a + (d.value || 0), 0) / 1000).toFixed(0)}K</td></tr>
                    <tr><td>Interview</td><td>${reportData.stageBreakdown.interview.length}</td><td>$${(reportData.stageBreakdown.interview.reduce((a, d) => a + (d.value || 0), 0) / 1000).toFixed(0)}K</td></tr>
                    <tr><td>Offer</td><td>${reportData.stageBreakdown.offer.length}</td><td>$${(reportData.stageBreakdown.offer.reduce((a, d) => a + (d.value || 0), 0) / 1000).toFixed(0)}K</td></tr>
                    <tr><td>Closed Won</td><td>${reportData.stageBreakdown.closed.length}</td><td>$${(reportData.stageBreakdown.closed.reduce((a, d) => a + (d.value || 0), 0) / 1000).toFixed(0)}K</td></tr>
                </table>
                
                <h2>Top Opportunities</h2>
                <table>
                    <tr><th>Company</th><th>Role</th><th>Value</th><th>Probability</th></tr>
                    ${reportData.topDeals.map(d => `<tr><td>${d.company}</td><td>${d.role}</td><td>$${((d.value || 0) / 1000).toFixed(0)}K</td><td>${d.probability}%</td></tr>`).join('')}
                </table>
                
                <h2>Network Intelligence</h2>
                <div class="metric">
                    <div class="metric-value">${reportData.totalContacts}</div>
                    <div class="metric-label">Total Contacts</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${reportData.tier1Count}</div>
                    <div class="metric-label">Tier 1 VIPs</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${reportData.activeCount}</div>
                    <div class="metric-label">Active Leads</div>
                </div>
                
                <div class="footer">
                    Generated by BASIN::NEXUS Sovereign Executive Edition | Classification: CONFIDENTIAL
                </div>
            </body>
            </html>
        `;

        // Open print dialog
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }

        setIsGenerating(false);
        addNotification?.('SUCCESS', 'Report Generated', 'Executive briefing ready for export');
    };

    return (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} className="text-[#D4AF37]" /> Executive Report
                </h3>
                <button
                    onClick={generatePDF}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${isGenerating
                            ? 'bg-slate-800 text-slate-600'
                            : 'bg-[#D4AF37] text-black hover:bg-yellow-500'
                        }`}
                >
                    {isGenerating ? <Clock size={14} className="animate-spin" /> : <Download size={14} />}
                    {isGenerating ? 'Generating...' : 'Export PDF'}
                </button>
            </div>

            {/* Report Preview */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign size={12} className="text-emerald-400" />
                            <span className="text-[8px] font-bold uppercase text-slate-500">Pipeline</span>
                        </div>
                        <div className="text-lg font-black text-white">
                            ${reportData.totalValue >= 1000000 ? `${(reportData.totalValue / 1000000).toFixed(1)}M` : `${(reportData.totalValue / 1000).toFixed(0)}K`}
                        </div>
                    </div>
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <Target size={12} className="text-cyan-400" />
                            <span className="text-[8px] font-bold uppercase text-slate-500">Weighted</span>
                        </div>
                        <div className="text-lg font-black text-white">
                            ${(reportData.weightedValue / 1000).toFixed(0)}K
                        </div>
                    </div>
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <Briefcase size={12} className="text-purple-400" />
                            <span className="text-[8px] font-bold uppercase text-slate-500">Deals</span>
                        </div>
                        <div className="text-lg font-black text-white">{reportData.totalDeals}</div>
                    </div>
                    <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <Users size={12} className="text-orange-400" />
                            <span className="text-[8px] font-bold uppercase text-slate-500">Network</span>
                        </div>
                        <div className="text-lg font-black text-white">{reportData.totalContacts}</div>
                    </div>
                </div>

                {/* Top Deals Preview */}
                <div className="p-3 bg-slate-900/30 border border-slate-800 rounded-xl">
                    <div className="text-[9px] font-bold uppercase text-slate-500 mb-2">Top Opportunities</div>
                    <div className="space-y-1">
                        {reportData.topDeals.slice(0, 3).map(deal => (
                            <div key={deal.id} className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">{deal.company}</span>
                                <span className="text-white font-mono">${((deal.value || 0) / 1000).toFixed(0)}K</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveReport;
