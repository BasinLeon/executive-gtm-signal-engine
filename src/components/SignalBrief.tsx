import { useState } from 'react';

const SignalBrief = () => {
    const [exported, setExported] = useState(false);

    const handleExport = () => {
        window.print();
        setExported(true);
        setTimeout(() => setExported(false), 3000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '20px 0',
            fontFamily: '"Times New Roman", Georgia, serif',
            color: '#1a1a1a',
            fontSize: '11pt',
            lineHeight: '1.4'
        }}>

            {/* CONTROL BAR */}
            <div className="print:hidden" style={{
                maxWidth: '850px',
                margin: '0 auto 20px auto',
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '0 20px'
            }}>
                <button
                    onClick={handleExport}
                    style={{
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '11px',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: '#1a365d',
                        color: '#fff',
                        borderRadius: '4px'
                    }}
                >
                    {exported ? '✓ Exported' : 'Export Brief (PDF)'}
                </button>
            </div>

            {/* EXECUTIVE ARTIFACT CONTAINER */}
            <div className="print-artifact" style={{
                backgroundColor: '#ffffff',
                maxWidth: '850px',
                margin: '0 auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '50px 60px',
                color: '#1a1a1a'
            }}>

                {/* HEADER */}
                <header style={{ marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '22pt',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontFamily: '"Times New Roman", Georgia, serif'
                    }}>
                        Executive GTM Signal Brief
                    </h1>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 200px 80px 1fr',
                        gap: '8px 10px',
                        fontSize: '10pt',
                        fontFamily: '"Times New Roman", serif'
                    }}>
                        <span style={{ fontVariant: 'small-caps', color: '#666' }}>to:</span>
                        <span>Executive Review Board</span>
                        <span style={{ fontVariant: 'small-caps', color: '#666' }}>from:</span>
                        <span>Leon Basin, Revenue Architect</span>
                        <span style={{ fontVariant: 'small-caps', color: '#666' }}>date:</span>
                        <span>January 1, 2026</span>
                        <span style={{ fontVariant: 'small-caps', color: '#666' }}>subject:</span>
                        <span>GTM Signal and Pipeline Health Review</span>
                    </div>
                </header>

                <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '20px 0' }} />

                {/* 1. BLUF */}
                <section style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        1) Bottom Line Up Front (BLUF)
                    </h2>
                    <ul style={{ paddingLeft: '25px', listStyleType: 'disc', margin: 0 }}>
                        <li style={{ marginBottom: '8px' }}><strong>Signal:</strong> High-volume activity in the "War Room" (NVIDIA, eBay) is being obscured by stagnation in the "Freezer" (SnapMagic, Aikido).</li>
                        <li style={{ marginBottom: '8px' }}><strong>Risk:</strong> Pipeline value is artificially inflated by "zombie deals" in the $3k to $5k per month range that have stalled beyond 30 days.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Decision Required:</strong> Purge stalled accounts and consolidate "Fractional" plus "War Room" signals into a single drag-and-drop view that forces weekly kill or promote decisions.</li>
                    </ul>
                </section>

                {/* 2. CURRENT STATE */}
                <section style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        2) Current State Assessment
                    </h2>
                    <ul style={{ paddingLeft: '25px', listStyleType: 'disc', margin: 0 }}>
                        <li style={{ marginBottom: '8px' }}><strong>Pipeline Fragmentation:</strong> Deal context is split across "War Room" CSVs (prioritized outreach) and "Network" tracking, creating a recurring weekly reconciliation drag (estimated 4 hours).</li>
                        <li style={{ marginBottom: '8px' }}><strong>Stalled Inventory:</strong> The "Freezer" contains high-potential logos (SnapMagic, Mistral AI) with no movement since late November, creating false coverage in the forecast.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Active Velocity:</strong> "Fractional" pipeline shows healthier motion, with FYM Partners ($5k per month) and TechFlow ($1.5k per month) advancing into proposal or active stages.</li>
                    </ul>
                </section>

                {/* 3. SIGNAL ASSESSMENT */}
                <section style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        3) Signal Assessment
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', fontSize: '10pt' }}>
                        {/* LEFT COL: WORKING */}
                        <div>
                            <h3 style={{ fontWeight: 'bold', fontSize: '10pt', textTransform: 'uppercase', marginBottom: '10px', color: '#000' }}>What is Working (Signal)</h3>
                            <ul style={{ paddingLeft: '18px', listStyleType: 'disc', margin: 0 }}>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Visual prioritization</strong><br />
                                    <span style={{ fontSize: '9.5pt' }}>The drag-and-drop engine correctly surfaces velocity. FYM Partners (70% probability) separates from noise quickly when stage changes are forced.</span>
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Lead quality</strong><br />
                                    <span style={{ fontSize: '9.5pt' }}>"War Room" inputs (Trust in Soda, Fastino AI) are high-quality, but require immediate next-step enforcement to prevent drift.</span>
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT COL: NOT WORKING */}
                        <div>
                            <h3 style={{ fontWeight: 'bold', fontSize: '10pt', textTransform: 'uppercase', marginBottom: '10px', color: '#666' }}>What is Not Working (Noise)</h3>
                            <ul style={{ paddingLeft: '18px', listStyleType: 'disc', margin: 0 }}>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Zombie deals</strong><br />
                                    <span style={{ fontSize: '9.5pt' }}>Andromeda and Hightouch are stuck in "Stalled" with reactivation dates drifting into late January or February, inflating perceived coverage.</span>
                                </li>
                                <li style={{ marginBottom: '10px' }}>
                                    <strong>Manual toil</strong><br />
                                    <span style={{ fontSize: '9.5pt' }}>Weekly status reporting still requires cross-referencing "Network" and "War Room" tracking to determine the true stage and next action.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. RISKS & CONSTRAINTS */}
                <section style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        4) Risks and Constraints
                    </h2>
                    <ul style={{ paddingLeft: '25px', listStyleType: 'disc', margin: 0 }}>
                        <li style={{ marginBottom: '8px' }}><strong>Forecast drift:</strong> Without a hard "Kill/Promote" rule, forecast is inflated by approximately 30% due to inactive "Freezer" deals.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Input discipline:</strong> Signal quality depends on disciplined inputs. Stalled dates must be treated as constraints, not suggestions (example: SnapMagic reactivation by 1/15).</li>
                    </ul>
                </section>

                {/* 5. RECOMMENDED ACTIONS */}
                <section style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        5) Recommended Actions (This Week)
                    </h2>
                    <ol style={{ paddingLeft: '25px', listStyleType: 'decimal', margin: 0 }}>
                        <li style={{ marginBottom: '8px' }}><strong>Purge the Freezer:</strong> Mark SnapMagic, Aikido, and Mistral AI as Closed/Lost if there is no engagement by January 15.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Consolidate signal:</strong> Adopt the drag-and-drop engine as the single source of truth and stop manual CSV reconciliation.</li>
                        <li style={{ marginBottom: '8px' }}><strong>Standardize review:</strong> Use this PDF as the default Friday review artifact to force decisions, not status recitation.</li>
                    </ol>
                </section>

                {/* 6. PROOF OF WORK */}
                <section style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        6) Proof of Work
                    </h2>

                    {/* IMAGE CONTAINER */}
                    <div style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                        <img
                            src="/proof-dnd.png"
                            alt="Live GTM Signal Engine - Revenue Ops"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                    </div>

                    <p style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', textAlign: 'center', margin: 0 }}>
                        Figure 1: Live GTM Signal Engine demonstrating visual stage management of Fractional and War Room pipelines.
                    </p>
                </section>

                <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '25px 0 15px 0' }} />

                {/* FOOTER */}
                <footer style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '8pt',
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    <span>Leon Basin // Revenue Architect</span>
                    <span>Executive GTM Signal Engine</span>
                    <span>Page 1 of 1</span>
                </footer>

            </div>
        </div>
    );
};

export default SignalBrief;
