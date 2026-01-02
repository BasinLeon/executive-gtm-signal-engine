
import { UserState, JobStage } from './types.ts';

export const INITIAL_STATE: UserState = {
    name: 'Leon Basin',
    role: 'Senior GTM Leader',
    level: 9,
    xp: 9250,
    dayStreak: 21,
    streak: 21,
    revenueTarget: 3000000,
    metrics: [],
    neuralCore: {
        identity: "15-year Technical Closer specializing in complex API and Security sales.",
        ledger: ["160% Pipeline Growth at Fudo Security", "$10M Pipeline generated at Sense"],
        caseStudies: "Built Fudo Security's US territory from scratch.",
        playbooks: ["MEDDICC", "Challenger", "Command of the Message"],
        techStack: ["Salesforce", "Apollo.io", "Gong", "LinkedIn Sales Nav"],
        personas: ["The Technical Hunter", "The Executive Closer", "The GTM Architect"],
        marketThesis: "The future of API sales is shifting from technical validation to business outcome mapping.",
        narrativeForge: [],
        assetLibrary: [],
        dojoIntel: [],
        roadmap: "Pivot to Individual Contributor role in Series B Fintech/Security.",
        culturalAlignment: "High-performance, engineering-first cultures with transparent feedback loops.",
        leadershipPhil: "Lead from the front, radical candor, outcomes over activity.",
        revenueArchitecture: "Specialized in building repeatable $0-$10M ARR playbooks.",
        ecosystemGraph: "Strong connections in Cyber Security, Infrastructure, and Fintech VC space.",
        riskMitigation: "Deep understanding of legal and security hurdles in Enterprise procurement.",
        productVision: "Integrating AI directly into the sales workflow to reduce administrative friction.",
        talentStrategy: "Recruiting A-players by selling the mission, not just the OTE.",
        categoryTheory: "Moving from Cyber Security to Trust Infrastructure.",
        unitEconomics: "Mastery of LTV:CAC and Magic Number optimization.",
        boardPresence: "Experienced in quarterly reporting and quarterly business reviews.",
        executiveSynthesis: "The convergence of sales prowess and architectural depth."
    },
    masterResume: "15-year Technical Closer specializing in complex API and Security sales.",
    caseStudies: "Built Fudo Security's US territory from scratch.",
    portfolio: "...",
    contacts: [
        { id: 'nc1', tier: '1', name: 'Aayushi Gupta', company: 'Astreya', role: 'Recruiter', status: 'ACTIVE', lastTouch: '2025-12-10', strategy: 'Pitch: "Google Ops + AI Automation".' },
        { id: 'nc2', tier: '1', name: 'Ed Carr', company: 'Unknown', role: 'Exec Recruiter', status: 'REVIVED', lastTouch: '2025-12-10', strategy: 'Pitch: "Elite Cyber GTM" (Apologized for delay).' },
        { id: 'nc3', tier: '1', name: 'Charlie Celaya', company: 'Ottimate', role: 'Prog Manager', status: 'ACTIVE', lastTouch: '2025-12-10', strategy: 'Pitch: "Scaling $50M -> $200M".' },
        { id: 'nc4', tier: '1', name: 'Oliver Perry', company: 'Fintech Rec', role: 'Managing Dir', status: 'REVIVED', lastTouch: '2025-12-10', strategy: 'Pitch: "Regulation + AI" (Fintech leverage).' },
        { id: 'nc5', tier: '1', name: 'Basavaraj Biradar', company: 'Talent-Matics', role: 'Recruiter', status: 'REVIVED', lastTouch: '2025-12-10', strategy: 'Pitch: "CRO Reporting / Sales Ops".' },
        { id: 'nc6', tier: '1', name: 'Minh Pham', company: 'NVIDIA', role: 'Champion', status: 'ACTIVE', lastTouch: '2025-12-09', strategy: 'Action: Send him 2 new Job Links.' },
        { id: 'nc7', tier: '2', name: 'Ryan Richardson', company: 'SnapMagic', role: 'Champion', status: 'ACTIVE', lastTouch: '2025-12-09', strategy: 'Waiting for Gartner referral.' },
        { id: 'nc8', tier: '2', name: 'Greg Bennett', company: 'Tech Co', role: 'VP Sales Ops', status: 'WARM', lastTouch: '2025-12-02', strategy: 'Peer Networking.' },
        { id: 'nc9', tier: '2', name: 'Yucheng Chen', company: 'IntelliPro', role: 'Recruiter', status: 'WARM', lastTouch: '2025-12-10', strategy: 'Target for Ant International Multi-thread.' },
        { id: 'nc10', tier: '1', name: 'Xan Marcucci', company: 'Confetti', role: 'Founder/Recruiter', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitch: "Revenue Architect" + Referral Partner.' },
        { id: 'nc11', tier: '2', name: 'John G Dodson', company: 'AI/Robotics', role: 'Sales Strategy', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Peer GTM Architect. Sync Jan 5th.' },
        { id: 'nc12', tier: '1', name: 'Sinjini Kar', company: 'Guidepoint', role: 'Research Consultant', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Paid Consultation ($250/hr). Focus: CX/AI/Ops.' },
        { id: 'nc13', tier: '3', name: 'Elite Kadriu', company: 'Business Reporter', role: 'Campaign Director', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched FREE Quoted Expert Input (High Status/No Cost).' },
        { id: 'nc14', tier: '2', name: 'Lidiia Mandrovna', company: 'Apriorit', role: 'VP of Innovation', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Peer-to-Peer. Align GTM Arch with Cyber Dev/Rust.' },
        { id: 'nc15', tier: '2', name: 'Harry Silvester', company: 'Deel', role: 'Growth/Revenue', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as GTM Executive for their Cyber clients.' },
        { id: 'nc16', tier: '2', name: 'Vaishali Selvaraj', company: 'Recruiter', role: 'Talent Acquisition', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as Senior/Director of GTM for Referrals.' },
        { id: 'nc17', tier: '1', name: 'Romana Bucur', company: 'SCU Leavey School of Business', role: 'Sr. Assistant Dean', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as Executive Candidate. Requesting referrals/introductions.' },
        { id: 'nc18', tier: '1', name: 'Rod Schecter', company: 'Aviatrix', role: 'Strategic Account Leader', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as GTM peer/candidate in AI Security. Requesting sync.' },
        { id: 'nc19', tier: '1', name: 'David Dannenbaum', company: 'The Schwartz Group', role: 'Cybersecurity Recruiter', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as VP GTM candidate. Requesting executive openings.' },
        { id: 'nc20', tier: '3', name: 'Zak Richer', company: 'Obex Recruitment', role: 'Mining Recruiter', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Disqualified role; Pitched self as Senior/Director GTM candidate for future leads.' },
        { id: 'nc21', tier: '1', name: 'Sara Velasquez', company: 'Seccuri', role: 'Growth Lead', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as GTM Executive Candidate. Target: CEO/Strategic roles.' },
        { id: 'nc22', tier: '1', name: 'Karl Zhao, PhD', company: 'Gabe IO', role: 'CEO / AI Thought Leader', status: 'ACTIVE', lastTouch: '2025-12-11', strategy: 'Peer-to-Peer AI GTM Architecture Sync. Book post-vacation.' },
        { id: 'nc23', tier: '1', name: 'Mustafa Al Quraishi', company: 'Oxels / EF', role: 'AI RevOps Founder', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as AI RevOps Architect Peer.' },
        { id: 'nc24', tier: '1', name: 'Will Sutton', company: 'tethr', role: 'GTM Recruiter', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Converted from client to candidate for Senior/Director GTM roles.' },
        { id: 'nc25', tier: '1', name: 'Amy Wildermuth, MBA', company: 'Founder & CEO', role: 'Capital Strategist', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as Senior/Director GTM candidate in Healthcare/Fintech.' },
        { id: 'nc26', tier: '1', name: 'Jared Black', company: 'NewVine Employment Group', role: 'CEO, AI Recruiter', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as Senior/Director GTM candidate. Requesting executive openings.' },
        { id: 'nc27', tier: '1', name: 'Abir "Bandy" Bandyopadhyay', company: 'Marketing Executive', role: 'FinTech Executive', status: 'REVIVED', lastTouch: '2025-12-11', strategy: 'Pitched Self as Senior/Director GTM candidate in his ecosystem' },
        { id: 'nc28', tier: '2', name: 'Janice Lucien', company: 'Salesforce', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc29', tier: '2', name: 'Dara Jamison', company: 'Uber', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc30', tier: '2', name: 'John K.', company: 'Spearhead Technologies', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc31', tier: '2', name: 'Lauren Gracia', company: 'SwingSearch', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc32', tier: '2', name: 'Sonia Bose', company: 'Cupertino Electric', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc33', tier: '2', name: 'Bobby Ho', company: 'Vanetta Partners', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc34', tier: '2', name: 'Laney Oaks Okolicany', company: 'Farallon Capital', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc35', tier: '2', name: 'Mary Fox Bouygues', company: 'Mighty Networks', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc36', tier: '2', name: 'Audrey Bailey', company: 'Sevita', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc37', tier: '2', name: 'Stacey Bernson', company: 'SCN', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc38', tier: '2', name: 'Nicola Bryan', company: 'Neuraflash', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc39', tier: '2', name: 'Joc T.', company: 'Nomadic Networkers', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc40', tier: '2', name: 'Angelo Giallombardo', company: 'Central Executive Search', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc41', tier: '2', name: 'Debbie Hale', company: 'TopHire Group', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc42', tier: '2', name: 'Tori Gunzenhauser', company: 'Electronic Arts', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc43', tier: '2', name: 'Amy DeRiggi', company: 'Gutterglove', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc44', tier: '2', name: 'Rachit Moti', company: 'Accord', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc45', tier: '2', name: 'Melina Iacovou', company: 'Intuit Mailchimp', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc46', tier: '2', name: 'Sana Akhand', company: 'UNION', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc47', tier: '2', name: 'Joel Mac', company: 'MetaChase', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc48', tier: '2', name: 'Tracy Cook', company: 'Crestron Electronics', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc49', tier: '2', name: 'Hector Reyes', company: 'Crestron Electronics', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc50', tier: '2', name: 'Jim Janosik', company: 'J. Paul Partners', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc51', tier: '2', name: 'Taylor Henze', company: 'Platform Science', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc52', tier: '2', name: 'Evan Procter', company: 'UpRoar Partners', role: 'N/A', status: 'REVIVED', lastTouch: '2025-12-17', strategy: 'N/A' },
        { id: 'nc53', tier: '1', name: 'Ashley Snell', company: 'AS Recruitment', role: 'Headhunter', status: 'ACTIVE', lastTouch: '2025-12-17', strategy: 'Revenue Architect (A-Player/AI Niche).' },
        { id: 'nc54', tier: '1', name: 'CJ Babb', company: 'American Express', role: 'Sr Mgr', status: 'SCHEDULING', lastTouch: '2025-12-17', strategy: 'Peer Sync. Pitched "GTM OS" & Virtual Coffee.' },
        { id: 'nc55', tier: '1', name: 'Ramesh Babu Bairy', company: 'Unknown (Stealth)', role: 'Chief Digital Officer', status: 'SCHEDULING', lastTouch: '2025-12-17', strategy: 'Peer Sync. CDO level. Aligning Digital Transf. w/ Rev Arch.' },
        { id: 'nc56', tier: '1', name: 'Syed Ali Ahmed', company: 'Unknown (Stealth)', role: 'Managing Director', status: 'WARM', lastTouch: '2025-12-17', strategy: 'Old Co-worker, friend' },
        { id: 'nc57', tier: '1', name: 'Angelo Giallombardo', company: 'Central Exec Search', role: 'President', status: 'NURTURE', lastTouch: '2025-12-18', strategy: 'Disqualified Sales Eng role. Pivoted to Director/VP search.' },
        { id: 'nc58', tier: '1', name: 'Gia Thomas', company: 'inbound', role: 'Recruiter', status: 'NURTURE', lastTouch: '2025-12-28', strategy: '' },
        { id: 'nc59', tier: '1', name: 'Ethan Harris', company: 'inbound', role: 'N/A', status: 'NURTURE', lastTouch: '2025-12-28', strategy: '' },
        { id: 'nc60', tier: '1', name: 'Jonathan Goldberg', company: 'ManTech', role: 'Prospect/Champion', status: 'PASSIVE', lastTouch: '2025-12-28', strategy: 'EVIDENCE: The ManTech P0 Win. Save for Reference Check.' },
        // WAR ROOM - ACTIVE HIRING MANAGERS & RECRUITERS (JAN 2026)
        { id: 'wr1', tier: '1', name: 'Casey Taranella', company: 'Ambient.ai', role: 'Recruiting Ops Lead', status: 'ACTIVE', lastTouch: '2026-01-07', strategy: 'Jan 7 Meeting. External agency (Sloane Staffing).' },
        { id: 'wr2', tier: '1', name: 'Smita Philip', company: 'QuantumScape', role: 'Sr. TA Consultant', status: 'ACTIVE', lastTouch: '2026-01-09', strategy: 'Internal TA. Handling your application.' },
        { id: 'wr3', tier: '1', name: 'Lauren Benoit', company: 'Halter', role: 'Sr. TA Partner', status: 'ACTIVE', lastTouch: '2026-01-09', strategy: 'Internal TA. Managing Regional Sales Manager role.' },
        { id: 'wr4', tier: '1', name: 'Paul-Christopher Campbell', company: 'LiveRamp', role: 'Lead PMM', status: 'ACTIVE', lastTouch: '2026-01-10', strategy: 'Active. Contact for Lead PMM role.' },
        { id: 'wr5', tier: '1', name: 'Vivian Tang', company: 'Ant International', role: 'Director BD', status: 'ACTIVE', lastTouch: '2025-12-12', strategy: 'Hiring Manager. Resume is with her.' },
        { id: 'wr6', tier: '1', name: 'Paulo', company: 'eBay', role: 'Sr Mgr Seller Success', status: 'ACTIVE', lastTouch: '2025-12-12', strategy: 'Hiring Manager. Texted & Emailed.' },
        { id: 'wr7', tier: '1', name: 'Marianne Kvitko', company: 'LinkedIn', role: 'Recruiter', status: 'ACTIVE', lastTouch: '2025-12-12', strategy: 'Internal. Waiting for system email re: 4 Req IDs.' },
        { id: 'wr8', tier: '1', name: 'Evgeniia Kosterina', company: 'Axiom', role: 'Founding Sales Exec', status: 'ACTIVE', lastTouch: '2025-12-12', strategy: 'Contact for Founding Sales role.' },
        { id: 'wr9', tier: '1', name: 'Brian Andres', company: 'Kumo.ai', role: 'Founding Recruiter', status: 'ACTIVE', lastTouch: '2025-12-11', strategy: 'Founding Recruiter. Pitching Tech Sales angle.' },
        { id: 'wr10', tier: '1', name: 'Aurelien Aubert', company: 'Cargo (YC S23)', role: 'Founding GTM Eng', status: 'REVIVED', lastTouch: '2025-12-15', strategy: 'Founding GTM role. Revived connection.' },
        { id: 'wr11', tier: '1', name: 'Jacques Dondoua', company: 'Trust in Soda', role: 'Recruiter', status: 'ACTIVE', lastTouch: '2025-12-22', strategy: 'Gateway to Fintech GTM roles.' },
        { id: 'wr12', tier: '1', name: 'Oliver Perry', company: 'Trust in Soda', role: 'Managing Director', status: 'ACTIVE', lastTouch: '2025-12-11', strategy: 'HOT Lead. Email sent with resume.' },
        { id: 'wr13', tier: '1', name: 'Allison', company: 'Fastino AI', role: 'Recruiter', status: 'ACTIVE', lastTouch: '2025-12-19', strategy: 'Interview scheduled (Dec 19 - needs follow-up).' },
        { id: 'wr14', tier: '1', name: 'Gautam Arya', company: 'Tredence', role: 'Growth Sales Leader', status: 'ACTIVE', lastTouch: '2025-12-19', strategy: 'Submitted rate ($150k) & strategic write-up.' },
        { id: 'wr15', tier: '1', name: 'Jung-Hong Kim', company: 'Klipy', role: 'US GTM Leader', status: 'ACTIVE', lastTouch: '2025-12-24', strategy: 'Founder role. Pitching Forward Operating Base.' },
        { id: 'wr16', tier: '1', name: 'Ido Goldberg', company: 'Swan AI', role: 'Founding GTM', status: 'ACTIVE', lastTouch: '2025-12-20', strategy: 'Pitching Fellow Builder narrative.' },
        { id: 'wr17', tier: '1', name: 'Jaime Muirhead', company: 'Skypoint', role: 'Director GTM', status: 'ACTIVE', lastTouch: '2025-12-28', strategy: 'Pitched Zero Trust + Healthcare AI.' },
        { id: 'wr18', tier: '1', name: 'Kaitlyn Finefrock', company: 'Brightedge', role: 'GTM Lead', status: 'ACTIVE', lastTouch: '2025-12-12', strategy: 'Src: Ryan Richardson.' },
        { id: 'wr19', tier: '1', name: 'Michael Rosenberg', company: 'CRS Credit API', role: 'Enterprise AE', status: 'ACTIVE', lastTouch: '2025-12-12', strategy: 'Interview confirmed with Tyler.' },
        { id: 'wr20', tier: '1', name: 'Sukhvir S.', company: 'Fastly', role: 'Senior/Director GTM', status: 'ACTIVE', lastTouch: '2025-12-19', strategy: 'Offered internal referral.' },
        { id: 'wr21', tier: '1', name: 'Jamie Schorr', company: 'Cezanne Recruiting', role: 'Account Executive', status: 'REVIVED', lastTouch: '2025-12-22', strategy: 'High-OTE closing role. Revived.' },
        // NETWORK - REFERRALS & CHAMPIONS
        { id: 'net1', tier: '1', name: 'Marina Nekhendzy-Basin', company: 'QuantumScape', role: 'Referral Source', status: 'ACTIVE', lastTouch: '2026-01-01', strategy: 'Your internal champion for the PMM role.' },
        { id: 'net2', tier: '2', name: 'Corinne McKeever', company: 'Considine Search', role: 'Staff Recruitment Dir.', status: 'WARM', lastTouch: '2025-12-17', strategy: 'Contact for Sr. BD Manager - Emerging Co.' },
        { id: 'net3', tier: '2', name: 'Coellen Camat', company: 'Spherion', role: 'Recruiter', status: 'WARM', lastTouch: '2025-12-17', strategy: 'Contact for Regional Sales Manager.' },
        { id: 'net4', tier: '2', name: 'Siena Brewster', company: 'PayPal', role: 'Recruiter', status: 'CLOSED', lastTouch: '2025-12-17', strategy: 'Contact for Customer Success Manager (Closed).' },
        { id: 'net5', tier: '2', name: 'Sara Hunter', company: 'Gartner', role: 'GTM Strategy', status: 'WARM', lastTouch: '2025-12-12', strategy: 'Src: Ryan Richardson.' },
        { id: 'net6', tier: '3', name: 'Kayleigh', company: 'Andromeda', role: 'Recruiter', status: 'STALLED', lastTouch: '2025-12-01', strategy: 'Ghosted. Deal stalled.' },
        { id: 'net7', tier: '2', name: 'Arka', company: 'AWS', role: 'Contact', status: 'OUTREACH', lastTouch: '2025-12-28', strategy: 'Outreach sent.' },
        { id: 'net8', tier: '2', name: 'Purva', company: 'Adobe', role: 'Contact', status: 'OUTREACH', lastTouch: '2025-12-28', strategy: 'Outreach sent.' }
    ],
    pipeline: [
        {
            id: 'j1', company: 'Trust in Soda', role: 'Fintech GTM Leads',
            stage: JobStage.INTERVIEWING, probability: 60, salary: '$200k+', value: 200000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-11', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Connect w/ Jacques', dueDate: '2025-12-11', notes: 'Email Sent w/ Resume. HOT Lead.', contacts: ['c1']
        },
        {
            id: 'j2', company: 'eBay', role: 'Sr Mgr Seller Success',
            stage: JobStage.APPLIED, probability: 30, salary: '$240k', value: 240000,
            intent: 'Medium', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 4',
            priority: 'P1', nextStep: 'Wait for Reply', dueDate: '2025-12-12', notes: 'Texted & Emailed (R0070456).', contacts: ['c2']
        },
        {
            id: 'j3', company: 'NVIDIA', role: 'Startup BD / DevRel',
            stage: JobStage.APPLIED, probability: 40, salary: '$280k', value: 280000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-13', securityProtocol: 'Level 5',
            priority: 'P1', nextStep: 'Check for Submission', dueDate: '2025-12-13', notes: 'Resume & 2 Roles Sent to Minh.', contacts: ['c3']
        },
        {
            id: 'j4', company: 'LinkedIn', role: '5x Sales Roles',
            stage: JobStage.APPLIED, probability: 40, salary: '$220k', value: 220000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 5',
            priority: 'P1', nextStep: 'Wait for System Email', dueDate: '2025-12-12', notes: '4 REQ IDs Sent to Marianne.', contacts: ['c4']
        },
        {
            id: 'j5', company: 'Axiom', role: 'Founding Sales Exec',
            stage: JobStage.APPLIED, probability: 20, salary: '$180k', value: 180000,
            intent: 'Medium', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 2',
            priority: 'P1', nextStep: 'Check for accept (24h)', dueDate: '2025-12-12', notes: 'Prob: 20% | Src: Ryan Richardson', contacts: ['c5']
        },
        {
            id: 'j6', company: 'Brightedge', role: 'GTM Lead',
            stage: JobStage.APPLIED, probability: 10, salary: '$160k', value: 160000,
            intent: 'Low', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 2',
            priority: 'P1', nextStep: 'Check for accept', dueDate: '2025-12-12', notes: 'Prob: 10% | Src: Ryan Richardson', contacts: ['c6']
        },
        {
            id: 'j7', company: 'Gartner', role: 'GTM Strategy',
            stage: JobStage.APPLIED, probability: 10, salary: '$180k', value: 180000,
            intent: 'Low', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 4',
            priority: 'P2', nextStep: 'Follow up w/ Ryan', dueDate: '2025-12-12', notes: 'Prob: 10% | Src: Ryan Richardson', contacts: ['c7']
        },
        {
            id: 'j8', company: 'CRS Credit API', role: 'Enterprise AE',
            stage: JobStage.INTERVIEWING, probability: 70, salary: '$220k', value: 220000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'PREP: Build Hunter Narrative', dueDate: '2025-12-12', notes: 'Confirmed: Interview w/ Tyler @ 11:30 AM.', contacts: ['c8']
        },
        {
            id: 'j9', company: 'Astreya', role: 'Service Delivery Mgr',
            stage: JobStage.INTERVIEWING, probability: 50, salary: '$200k', value: 200000,
            intent: 'Medium', triggers: [], lastEnriched: '2025-12-11', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'WAIT: For Interview Request', dueDate: '2025-12-11', notes: 'Sent Ops Resume + Matched JD Keywords.', contacts: ['c9']
        },
        {
            id: 'j10', company: 'LiveRamp', role: 'Lead PMM',
            stage: JobStage.INTERVIEWING, probability: 50, salary: '$230k', value: 230000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-11', securityProtocol: 'Level 4',
            priority: 'P1', nextStep: 'ACTION: Check Spam / Nudge', dueDate: '2025-12-11', notes: 'Waiting for Workday auto-invite.', contacts: ['c10']
        },
        {
            id: 'j11', company: 'Ant International', role: 'Director BD',
            stage: JobStage.APPLIED, probability: 40, salary: '$350k', value: 350000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 5',
            priority: 'P1', nextStep: 'WAIT: For HM Review', dueDate: '2025-12-12', notes: 'Resume w/ HM. Comp corrected to $350k.', contacts: ['c11']
        },
        {
            id: 'j12', company: 'Kumo.ai', role: 'Founding GTM Lead',
            stage: JobStage.INTERVIEWING, probability: 60, salary: '$200k', value: 200000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-11', securityProtocol: 'Level 4',
            priority: 'P1', nextStep: 'Send Qualifier DM', dueDate: '2025-12-11', notes: 'Founding Recruiter. Tech Sales angle.', contacts: ['c12']
        },
        {
            id: 'j13', company: 'Remote', role: 'Sr Mgr Partnerships',
            stage: JobStage.TARGET, probability: 20, salary: '$180k', value: 180000,
            intent: 'Medium', triggers: [], lastEnriched: '2025-12-12', securityProtocol: 'Level 3',
            priority: 'P2', nextStep: 'Wait for Referral', dueDate: '2025-12-12', notes: 'Asked for intro to GTM Leadership.', contacts: ['c13']
        },
        {
            id: 'j14', company: 'Cargo (YC S23)', role: 'Founding GTM Eng',
            stage: JobStage.APPLIED, probability: 30, salary: '$180k', value: 180000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-15', securityProtocol: 'Level 2',
            priority: 'P2', nextStep: 'Wait for Referral', dueDate: '2025-12-15', notes: 'Revived. Pitched Founding GTM role.', contacts: ['c14']
        },
        {
            id: 'j15', company: 'Cezanne Recruiting', role: 'Account Executive',
            stage: JobStage.APPLIED, probability: 40, salary: '$250k', value: 250000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-22', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Book Call Post-Vacation', dueDate: '2025-12-22', notes: 'Revived. High-OTE Closing Role.', contacts: ['c15']
        },
        {
            id: 'j16', company: 'Trust in Soda', role: 'Fintech GTM Leads',
            stage: JobStage.INTERVIEWING, probability: 60, salary: '$200k', value: 200000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-22', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Confirm Dec 22/23 Call', dueDate: '2025-12-22', notes: 'Replied w/ availability. Leveraged Sorai AI angle.', contacts: ['c16']
        },
        {
            id: 'j17', company: 'Seccuri', role: 'Strategic GTM Executive',
            stage: JobStage.INTERVIEWING, probability: 60, salary: '$200k', value: 200000,
            intent: 'High', triggers: [], lastEnriched: '2026-01-06', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Lock Jan 6/7 Meeting', dueDate: '2026-01-06', notes: 'Proposed Jan 6/7 for CEO (Juanita) Strategic Sync.', contacts: ['c17']
        },
        {
            id: 'j18', company: 'Fastino AI', role: 'Founding Sales Exec',
            stage: JobStage.INTERVIEWING, probability: 70, salary: '$200k', value: 200000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-19', securityProtocol: 'Level 4',
            priority: 'P1', nextStep: 'N/A', dueDate: '2025-12-19', notes: 'Interviewing', contacts: ['c18']
        },
        {
            id: 'j19', company: 'Tredence', role: 'Growth Sales Leader',
            stage: JobStage.APPLIED, probability: 40, salary: '$150k', value: 150000,
            intent: 'Medium', triggers: [], lastEnriched: '2025-12-19', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Wait for Client Feedback', dueDate: '2025-12-19', notes: 'Submitted Rate ($150k) & Strategic Write-up.', contacts: ['c19']
        },
        {
            id: 'j20', company: 'Fastly', role: 'Senior/Director GTM',
            stage: JobStage.APPLIED, probability: 50, salary: '$240k', value: 240000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-19', securityProtocol: 'Level 4',
            priority: 'P1', nextStep: 'Selecting Roles', dueDate: '2025-12-19', notes: 'Sukhvir offered internal referral. Check Careers Page.', contacts: ['c20']
        },
        {
            id: 'j21', company: 'Klipy', role: 'US GTM Leader',
            stage: JobStage.INTERVIEWING, probability: 60, salary: '$180k', value: 180000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-24', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Confirm Tue 4pm PT Sync', dueDate: '2025-12-24', notes: 'Founder Role. Pitched Forward Operating Base', contacts: ['c21']
        },
        {
            id: 'j22', company: 'Swan AI', role: 'Founding GTM',
            stage: JobStage.APPLIED, probability: 30, salary: '$180k', value: 180000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-20', securityProtocol: 'Level 4',
            priority: 'P1', nextStep: 'Wait for Reply', dueDate: '2025-12-20', notes: 'Pitched Fellow Builder/Basin::Nexus narrative', contacts: ['c22']
        },
        {
            id: 'j23', company: 'Skypoint', role: 'Director GTM',
            stage: JobStage.APPLIED, probability: 30, salary: '$200k', value: 200000,
            intent: 'High', triggers: [], lastEnriched: '2025-12-28', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Drive (CRM Updates)', dueDate: '2025-12-28', notes: 'Outreach. Pitched Zero Trust + Healthcare AI.', contacts: ['c23']
        },
        {
            id: 'j24', company: 'Adobe', role: 'N/A',
            stage: JobStage.APPLIED, probability: 10, salary: '$0', value: 0,
            intent: 'Low', triggers: [], lastEnriched: '2025-12-28', securityProtocol: 'Level 5',
            priority: 'P1', nextStep: 'N/A', dueDate: '2025-12-28', notes: 'N/A', contacts: ['c24']
        },
        {
            id: 'j25', company: 'AWS', role: 'N/A',
            stage: JobStage.APPLIED, probability: 10, salary: '$0', value: 0,
            intent: 'Low', triggers: [], lastEnriched: '2025-12-28', securityProtocol: 'Level 5',
            priority: 'P1', nextStep: 'N/A', dueDate: '2025-12-28', notes: 'N/A', contacts: ['c25']
        },
        // NEW P1 OPPORTUNITIES - JAN 2026
        {
            id: 'j26', company: 'Ambient.ai', role: 'Recruiting Ops Lead',
            stage: JobStage.INTERVIEWING, probability: 60, salary: '$220k', value: 220000,
            intent: 'High', triggers: [], lastEnriched: '2026-01-07', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Prep for Jan 7 Meeting', dueDate: '2026-01-07', notes: 'External agency (Sloane Staffing).', contacts: ['wr1']
        },
        {
            id: 'j27', company: 'QuantumScape', role: 'Sr. TA Consultant',
            stage: JobStage.APPLIED, probability: 50, salary: '$250k', value: 250000,
            intent: 'High', triggers: [], lastEnriched: '2026-01-09', securityProtocol: 'Level 4',
            priority: 'P1', nextStep: 'Wait for TA Review', dueDate: '2026-01-09', notes: 'Internal TA. Handling your application.', contacts: ['wr2']
        },
        {
            id: 'j28', company: 'Halter', role: 'Regional Sales Manager',
            stage: JobStage.APPLIED, probability: 40, salary: '$180k', value: 180000,
            intent: 'Medium', triggers: [], lastEnriched: '2026-01-09', securityProtocol: 'Level 3',
            priority: 'P1', nextStep: 'Wait for TA Response', dueDate: '2026-01-09', notes: 'Internal TA. Managing the role.', contacts: ['wr3']
        },
        // FRACTIONAL CLIENTS - CASH FLOW PIPELINE
        {
            id: 'frac1', company: 'FYM Partners', role: 'Fractional GTM',
            stage: JobStage.INTERVIEWING, probability: 70, salary: '$5k/mo', value: 60000,
            intent: 'High', triggers: [], lastEnriched: '2026-01-01', securityProtocol: 'Level 2',
            priority: 'P1', nextStep: 'Active Engagement', dueDate: '2026-01-15', notes: 'Fractional: $5k/mo - 70% Active', contacts: []
        },
        {
            id: 'frac2', company: 'TechFlow', role: 'Fractional Advisor',
            stage: JobStage.TARGET, probability: 50, salary: '$1.5k/mo', value: 18000,
            intent: 'Medium', triggers: [], lastEnriched: '2026-01-01', securityProtocol: 'Level 2',
            priority: 'P2', nextStep: 'Initial Call', dueDate: '2026-01-10', notes: 'Fractional: $1.5k/mo - 50% Initial Call', contacts: []
        },
        {
            id: 'frac3', company: 'SolveJet', role: 'Fractional GTM',
            stage: JobStage.APPLIED, probability: 40, salary: '$3k/mo', value: 36000,
            intent: 'Medium', triggers: [], lastEnriched: '2026-01-01', securityProtocol: 'Level 2',
            priority: 'P2', nextStep: 'Follow up on Proposal', dueDate: '2026-01-08', notes: 'Fractional: $3k/mo - 40% Proposal Sent', contacts: []
        },
        {
            id: 'frac4', company: 'Nexus AI', role: 'Fractional Advisor',
            stage: JobStage.TARGET, probability: 60, salary: '$2.5k/mo', value: 30000,
            intent: 'High', triggers: [], lastEnriched: '2026-01-01', securityProtocol: 'Level 2',
            priority: 'P2', nextStep: 'Send Proposal Draft', dueDate: '2026-01-10', notes: 'Fractional: $2.5k/mo - 60% Proposal Draft', contacts: []
        },
        {
            id: 'frac5', company: 'Spray.io', role: 'Fractional GTM',
            stage: JobStage.TARGET, probability: 30, salary: '$2k/mo', value: 24000,
            intent: 'Low', triggers: [], lastEnriched: '2026-01-01', securityProtocol: 'Level 2',
            priority: 'P3', nextStep: 'Scoping Call', dueDate: '2026-01-15', notes: 'Fractional: $2k/mo - 30% Scoping', contacts: []
        },
        {
            id: 'frac6', company: 'AlphaCorp', role: 'Fractional Advisor',
            stage: JobStage.TARGET, probability: 20, salary: '$4k/mo', value: 48000,
            intent: 'Low', triggers: [], lastEnriched: '2026-01-01', securityProtocol: 'Level 2',
            priority: 'P3', nextStep: 'Lead Qualification', dueDate: '2026-01-20', notes: 'Fractional: $4k/mo - 20% Lead', contacts: []
        }
    ],
    assets: [],
    sessionHistory: [],
    agents: [
        { id: 'a1', name: 'Social Nexus', type: 'SOCIAL', status: 'IDLE', lastAction: 'None', capabilities: ['Post Drafting', 'Thread Reply', 'Trend Analysis'] },
        { id: 'a2', name: 'Outreach Core', type: 'EMAIL', status: 'IDLE', lastAction: 'None', capabilities: ['Cold Outreach', 'Follow-up', 'Context Mapping'] },
        { id: 'a3', name: 'Web Architect', type: 'WEB', status: 'IDLE', lastAction: 'None', capabilities: ['Content Sync', 'Landing Page Optimization', 'SEO Tuning'] },
        // NEW AGENTS FOR JAN 2026 GOAL
        { id: 'a4', name: 'Interview Defender', type: 'INTERVIEW', status: 'ACTIVE', lastAction: 'None', capabilities: ['Mock Scenarios', 'STAR Method Drill', 'Technical Q&A'] },
        { id: 'a4', name: 'Negotiation Sentinel', type: 'NEGOTIATION', status: 'IDLE', lastAction: 'None', capabilities: ['Offer Analysis', 'Equity Modeling', 'Counter-Scripting'] },
        { id: 'a5', name: 'LinkedIn Sentinel', type: 'LINKEDIN', status: 'ACTIVE', lastAction: 'Monitoring Visitors', capabilities: ['Profile Visitor Scan', 'Connection Degree Check', 'Auto-DM Dispatch', 'CRM Sync'] }
    ],
    agentTasks: [],
    lastSimulacrumScore: 0
};

export const INTERVIEW_STAGES = [
    "Recruiter Screen",
    "Hiring Manager",
    "Technical Case Study",
    "Panel Strategy",
    "Final Exec Review"
];
