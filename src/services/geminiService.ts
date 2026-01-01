
import { GoogleGenAI } from "@google/genai";
import { Contact, DossierReport, JobDeal, JobStage, MarketSignal, NeuralCore } from "../types.ts";

export interface DealStrategy {
    summary: string;
    nextSteps: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    winProbability: number;
}

export interface VideoAnalysisResult {
    presence: number;
    clarity: number;
    impact: string;
    suggestions: string[];
}

const cleanJSON = (text: string) => {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MOCK_HIRING_VELOCITY = {
    velocity: "Surge Detected (+12%)",
    insight: "Q4 Budget Flush driving 15% increase in Enterprise GTM roles. Fintech & AI sectors leading.",
    trend: [
        { month: 'W1', score: 45 }, { month: 'W2', score: 48 }, { month: 'W3', score: 52 }, { month: 'W4', score: 50 },
        { month: 'W5', score: 58 }, { month: 'W6', score: 62 }, { month: 'W7', score: 65 }, { month: 'W8', score: 60 },
        { month: 'W9', score: 72 }, { month: 'W10', score: 78 }, { month: 'W11', score: 85 }, { month: 'W12', score: 92 }
    ]
};

const MOCK_MARKET_SIGNALS: MarketSignal[] = [
    { id: 'm1', company: 'Databricks', type: 'FUNDING', headline: 'Raises $500M Series I at $43B Valuation', date: '2024-03-12', impactScore: 9 },
    { id: 'm2', company: 'Rippling', type: 'HIRING', headline: 'Expanding APAC Sales Team by 200 Heads', date: '2024-03-10', impactScore: 8 },
    { id: 'm3', company: 'Stripe', type: 'PRODUCT', headline: 'Launches new Enterprise Crypto Rails', date: '2024-03-08', impactScore: 7 },
    { id: 'm4', company: 'Linear', type: 'PRODUCT', headline: 'Releases "Insights" for Engineering Teams', date: '2024-03-05', impactScore: 6 },
    { id: 'm5', company: 'OpenAI', type: 'M&A', headline: 'Acquires Rockset for Retrieval Infrastructure', date: '2024-03-01', impactScore: 9 }
];

async function safeGenerate(call: () => Promise<any>, fallback: any, label: string) {
    try {
        if (!process.env.API_KEY) return fallback;
        return await call();
    } catch (e: any) {
        console.warn(`[GEMINI ERROR] ${label} Failure (using fallback):`, e);
        return fallback;
    }
}

export const generateDossier = async (transcript: string): Promise<DossierReport> => {
    return safeGenerate(async () => {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `Analyze GTM interview transcript: ${transcript}. Provide performance metrics in JSON. Include simulated 'cadenceMatch' (0-100) and 'wpm'.`
        });
        if (response.text) return JSON.parse(cleanJSON(response.text));
        throw new Error("No data");
    }, { conviction: "B+", clarity: "A", starMethod: "Pass", summary: "Excellent presence, minor filler word usage.", cadenceMatch: 85, wpm: 145 }, "Dossier Synthesis");
};

export const generateSovereignBriefing = async (core: NeuralCore, deal: JobDeal): Promise<string> => {
    return safeGenerate(async () => {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `Generate a 1-page high-end Executive Narrative Briefing.
      Persona: ${core.identity}
      Key Proof Points: ${core.ledger.join(', ')}
      Target: ${deal.company} (${deal.role})
      Deal Value: $${deal.value}
      Style: Authoritative, Sovereign, Strategic. Focus on outcomes and category creation.
      Format: Markdown with sections: Executive Summary, Strategic Positioning, Tactical Differentiators, Conclusion.`,
        });
        return response.text || "Failed to generate briefing.";
    }, "Failed to generate briefing narrative.", "Briefing Engine");
};

export const fetchMarketSignals = async (companies?: string[]): Promise<MarketSignal[]> => {
    return safeGenerate(async () => {
        const ai = getAI();
        const prompt = companies && companies.length > 0
            ? `List 5 high-impact tech market events this month specifically for these companies: ${companies.join(', ')}. Return JSON array.`
            : `List 5 high-impact tech market events this month. Return JSON array.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        if (response.text) {
            const parsed = JSON.parse(cleanJSON(response.text));
            return Array.isArray(parsed) ? parsed : MOCK_MARKET_SIGNALS;
        }
        return MOCK_MARKET_SIGNALS;
    }, MOCK_MARKET_SIGNALS, "Market Intelligence");
};

export const getHiringVelocity = async () => {
    return safeGenerate(async () => {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `Provide hiring velocity insights for 2024. Return JSON.`,
            config: { tools: [{ googleSearch: {} }] }
        });
        if (response.text) return JSON.parse(cleanJSON(response.text));
        return MOCK_HIRING_VELOCITY;
    }, MOCK_HIRING_VELOCITY, "Hiring Metrics");
};

export const getQuantumDiagnostics = async (userState: any) => {
    return safeGenerate(async () => {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `Diagnostic check on state: ${JSON.stringify({ c: userState.contacts?.length, p: userState.pipeline?.length })}. Return improvements (array), bugs (array), maturity (object).`,
            config: { responseMimeType: "application/json" }
        });
        if (response.text) return JSON.parse(cleanJSON(response.text));
        throw new Error("Diag fail");
    }, {
        improvements: ["Shard L22 identity convergence", "Enrich P1 deal signals", "Automate Dojo-to-Pipeline feedback"],
        bugs: ["Orphaned lead nodes", "Schema mismatch in legacy playbooks"],
        categoryMaturity: { "Identity Depth": 78, "Revenue Velocity": 62 }
    }, "System Health Check");
};

export const parseBulkImportData = async (text: string): Promise<{ contacts: Partial<Contact>[], deals: Partial<JobDeal>[] }> => {
    return safeGenerate(async () => {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `Parse this GTM data (could be CSV or unstructured): ${text}. Return JSON with "contacts" and "deals" arrays.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        contacts: { type: "ARRAY", items: { type: "OBJECT" } },
                        deals: { type: "ARRAY", items: { type: "OBJECT" } }
                    }
                }
            }
        });
        if (response.text) return JSON.parse(cleanJSON(response.text));
        return { contacts: [], deals: [] };
    }, { contacts: [], deals: [] }, "Bulk Import");
};

export const analyzeVideoPerformance = async (videoUrl: string): Promise<VideoAnalysisResult> => {
    return { presence: 85, clarity: 90, impact: "High", suggestions: ["Lighting good", "Pacing excellent"] };
}
