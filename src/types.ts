

export enum AppView {
    DASHBOARD = 'DASHBOARD',
    DOJO = 'DOJO',
    NETWORK = 'NETWORK',
    PIPELINE = 'PIPELINE',
    KNOWLEDGE = 'KNOWLEDGE',
    AGENTS = 'AGENTS',
    MEDIA_OPS = 'MEDIA_OPS',
    VAULT = 'VAULT',
    PROFILE = 'PROFILE'
}

export enum JobStage {
    TARGET = 'Target',
    APPLIED = 'Applied',
    INTERVIEWING = 'Interview',
    OFFER = 'Offer',
    CLOSED = 'Closed'
}

export interface NeuralCore {
    identity: string;
    ledger: string[];
    caseStudies: string | string[];
    playbooks: string[];
    techStack: string[];
    personas: string[];
    marketThesis: string;
    narrativeForge: string[];
    assetLibrary: any[];
    dojoIntel: any[];
    roadmap: string;
    culturalAlignment: string;
    leadershipPhil: string;
    revenueArchitecture: string;
    ecosystemGraph: string;
    riskMitigation: string;
    productVision: string;
    talentStrategy: string;
    categoryTheory: string;
    unitEconomics: string;
    boardPresence: string;
    executiveSynthesis: string;
}

export interface NexusAgent {
    id: string;
    name: string;
    type: string;
    status: string;
    lastAction: string;
    capabilities: string[];
}

export interface AgentTask {
    id: string;
    type: string;
    status: string;
    description: string;
    result: string;
    timestamp: string;
}

export interface GeneratedAsset {
    id: string;
    type: string;
    url: string;
    prompt: string;
    createdAt: string;
    style: string;
}

export interface Contact {
    id: string;
    name: string;
    role: string;
    company: string;
    email?: string;
    linkedin?: string;
    lastContact?: string;
    notes?: string;
    status?: string;

    // V9.0 Sovereign Extensions
    tier?: '1' | '2' | '3';
    strategy?: string;
    lastTouch?: string;
}

export interface JobDeal {
    id: string;
    company: string;
    role: string;
    salary: string;
    value: number;
    probability: number;
    stage: JobStage;
    intent: string;
    triggers: any[];
    lastEnriched: string;
    securityProtocol: string;

    // V9.0 Sovereign Extensions
    priority?: 'P1' | 'P2' | 'P3';
    nextStep?: string;
    dueDate?: string;
    notes?: string;
    contacts?: string[]; // IDs of linked contacts
}

export interface UserState {
    name: string;
    role: string;
    level: number;
    xp: number;
    dayStreak: number;
    streak: number;
    revenueTarget: number;
    metrics: any[];
    neuralCore: NeuralCore;
    masterResume: string;
    caseStudies: string;
    portfolio: string;
    contacts: Contact[];
    pipeline: JobDeal[];
    assets: GeneratedAsset[];
    sessionHistory: any[];
    agents: NexusAgent[];
    agentTasks: AgentTask[];
    lastSimulacrumScore: number;
}

export interface MarketSignal {
    id: string;
    company: string;
    type: string;
    headline: string;
    date: string;
    impactScore: number;
}

export interface DojoSessionConfig {
    mode: string;
    stage: string;
    targetCompany: string;
    targetRole: string;
}

export interface SessionHistory {
    date: string;
    score: number;
    notes: string;
}

export interface DossierReport {
    summary: string;
    conviction: string | number;
    clarity: string | number;
    starMethod: string | number;
}
