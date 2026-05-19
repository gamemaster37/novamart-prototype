import { getDb } from "../database/db.js";
import { getCampaignAnalytics, getCampaignById, getCampaigns } from "./campaignService.js";
import { getCustomerProfile } from "./customerService.js";
import { getSupportCaseById } from "./supportCaseService.js";

type AiType = "customer_recommendation" | "campaign_recommendation" | "ticket_response";

type AiResult = {
  type: AiType;
  response: Record<string, unknown>;
  is_fallback: boolean;
  created_at?: string;
};

type DeepSeekResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

const modelName = "deepseek-v4-flash";
const defaultBaseUrl = "https://api.deepseek.com";

export async function generateCustomerRecommendation(customerId: number): Promise<AiResult> {
  const profile = getCustomerProfile(customerId);
  if (!profile) {
    throw Object.assign(new Error("Customer not found"), { status: 404 });
  }

  const prompt = `Return JSON only. Create a CRM next-best-action recommendation for this NovaMart customer using only the provided mock CRM context: ${JSON.stringify(
    profile
  )}. Required keys: churnRiskLevel, explanation, bestNextAction, recommendedCampaignOrCategory, personalisedCommunicationSuggestion.`;

  const fallback = {
    churnRiskLevel: (profile.customer as any).churn_risk,
    explanation: "Fallback demo recommendation based on purchase recency, lifetime value, and current segment.",
    bestNextAction:
      (profile.customer as any).churn_risk === "High"
        ? "Send a win-back offer with a service follow-up."
        : "Send a personalised category offer tied to recent purchases.",
    recommendedCampaignOrCategory: (profile.customer as any).preferred_category,
    personalisedCommunicationSuggestion: `Hi ${(profile.customer as any).first_name}, we noticed your interest in ${(profile.customer as any).preferred_category}. Here is a tailored NovaMart offer selected for you.`
  };

  const result = await callDeepSeekJson(prompt, fallback);
  return saveAiResult({
    type: "customer_recommendation",
    prompt,
    response: result.response,
    isFallback: result.isFallback,
    customerId
  });
}

export async function generateCampaignRecommendation(campaignId?: number): Promise<AiResult> {
  const campaign = campaignId ? getCampaignById(campaignId) : null;
  const context = {
    selectedCampaign: campaign,
    campaigns: getCampaigns(),
    analytics: getCampaignAnalytics()
  };

  const prompt = `Return JSON only. Create one NovaMart CRM campaign recommendation using this mock campaign context: ${JSON.stringify(
    context
  )}. Required keys: campaignIdea, targetAudience, recommendedChannel, personalisedMessageCopy, expectedOutcome.`;

  const fallback = {
    campaignIdea: "AI-assisted reactivation bundle for customers with high churn risk",
    targetAudience: campaign ? (campaign as any).target_segment : "At-risk customers",
    recommendedChannel: campaign ? (campaign as any).channel : "Email",
    personalisedMessageCopy:
      "We have selected a tailored NovaMart offer based on your recent interests. Return this week for an exclusive saving on your preferred category.",
    expectedOutcome: "Improve reactivation and increase campaign conversion among customers with declining purchase frequency."
  };

  const result = await callDeepSeekJson(prompt, fallback);
  return saveAiResult({
    type: "campaign_recommendation",
    prompt,
    response: result.response,
    isFallback: result.isFallback,
    campaignId
  });
}

export async function generateTicketResponse(supportCaseId: number): Promise<AiResult> {
  const supportCase = getSupportCaseById(supportCaseId);
  if (!supportCase) {
    throw Object.assign(new Error("Support case not found"), { status: 404 });
  }

  const prompt = `Return JSON only. Draft a human-reviewed support response for this NovaMart support case. Do not claim the response was sent and do not close the ticket. Context: ${JSON.stringify(
    supportCase
  )}. Required keys: ticketSummary, issueCategory, priorityRecommendation, suggestedCustomerResponse, internalSupportNote, recommendedNextAction, escalationNeeded, escalationReason.`;

  const fallback = {
    ticketSummary: (supportCase as any).title,
    issueCategory: (supportCase as any).category,
    priorityRecommendation: (supportCase as any).priority,
    suggestedCustomerResponse: `Hi ${(supportCase as any).customer_name}, thanks for contacting NovaMart. We are reviewing your case and the ${(supportCase as any).assigned_team} team will follow up with the next step.`,
    internalSupportNote: "Fallback draft generated from case category, priority, and assigned team. Human review is required before sending.",
    recommendedNextAction: `Review the case details and confirm ownership with ${(supportCase as any).assigned_team}.`,
    escalationNeeded: (supportCase as any).priority === "High" ? "yes" : "no",
    escalationReason:
      (supportCase as any).priority === "High" ? "High-priority or high-value customer issue." : "No immediate escalation trigger detected."
  };

  const result = await callDeepSeekJson(prompt, fallback);
  return saveAiResult({
    type: "ticket_response",
    prompt,
    response: result.response,
    isFallback: result.isFallback,
    supportCaseId
  });
}

async function callDeepSeekJson(prompt: string, fallback: Record<string, unknown>) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey || apiKey === "your_deepseek_api_key_here") {
    return { response: fallback, isFallback: true };
  }

  try {
    const baseUrl = (process.env.DEEPSEEK_BASE_URL || defaultBaseUrl).replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant for a university retail CRM demo. Return concise, safe, presentation-ready JSON only. Do not include markdown."
          },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        stream: false
      })
    });

    const payload = (await response.json()) as DeepSeekResponse;
    if (!response.ok) {
      throw new Error(payload.error?.message || `DeepSeek API request failed with status ${response.status}`);
    }

    const text = payload.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("DeepSeek API response did not include message content");
    }

    return { response: parseJson(text, fallback), isFallback: false };
  } catch (error) {
    console.error("DeepSeek request failed, using fallback response.", error);
    return { response: fallback, isFallback: true };
  }
}

function parseJson(text: string, fallback: Record<string, unknown>) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return { ...fallback, modelText: text };
    }
    try {
      return JSON.parse(match[0]);
    } catch {
      return { ...fallback, modelText: text };
    }
  }
}

function saveAiResult(input: {
  type: AiType;
  prompt: string;
  response: Record<string, unknown>;
  isFallback: boolean;
  customerId?: number;
  campaignId?: number;
  supportCaseId?: number;
}): AiResult {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO ai_recommendations (
        customer_id, campaign_id, support_case_id, type, prompt, response, is_fallback
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.customerId ?? null,
      input.campaignId ?? null,
      input.supportCaseId ?? null,
      input.type,
      input.prompt,
      JSON.stringify(input.response),
      input.isFallback ? 1 : 0
    );

  const saved = db.prepare("SELECT created_at FROM ai_recommendations WHERE id = ?").get(result.lastInsertRowid) as any;

  return {
    type: input.type,
    response: input.response,
    is_fallback: input.isFallback,
    created_at: saved?.created_at
  };
}
