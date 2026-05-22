import { Sparkles } from "lucide-react";
import type { AiRecommendation } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { StatusBadge } from "./StatusBadge";

export function AIRecommendationCard({ recommendation, title = "AI Recommendation" }: { recommendation: AiRecommendation; title?: string }) {
  const response = typeof recommendation.response === "string" ? { response: recommendation.response } : recommendation.response;
  const isFallback = recommendation.is_fallback === true || recommendation.is_fallback === 1 || recommendation.is_fallback === "true";

  return (
    <Card className="border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <CardTitle>{title}</CardTitle>
        </div>
        <StatusBadge value={isFallback ? "Fallback demo response" : "AI response"} />
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 text-sm">
          {Object.entries(response).map(([key, value]) => (
            <div key={key}>
              <dt className="font-semibold capitalize text-slate-600">{key.replace(/([A-Z])/g, " $1")}</dt>
              <dd className="mt-1 leading-6 text-slate-800">{String(value)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          AI output is a decision-support draft only. Human review is required before customer action.
        </p>
      </CardContent>
    </Card>
  );
}
