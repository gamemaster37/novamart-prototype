import { Bot, DollarSign, Megaphone, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../api/client";
import { AIRecommendationCard } from "../components/AIRecommendationCard";
import { DataTable } from "../components/DataTable";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import type { AiRecommendation, Campaign } from "../types";
import { currency, date, percent } from "../utils/format";

type CampaignPayload = {
  campaigns: Campaign[];
  analytics: {
    totalCampaigns: number;
    averageConversion: number;
    totalRevenue: number;
    topCampaigns: Campaign[];
  };
};

export function Campaigns() {
  const [payload, setPayload] = useState<CampaignPayload | null>(null);
  const [aiResult, setAiResult] = useState<AiRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<CampaignPayload>("/api/campaigns")
      .then(setPayload)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const generateRecommendation = async () => {
    setAiLoading(true);
    setError("");
    try {
      setAiResult(await apiPost<AiRecommendation>("/api/ai/campaign-recommendation", {}));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Campaign AI request failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <LoadingState label="Loading campaigns" />;
  if (error && !payload) return <ErrorState message={error} />;
  if (!payload) return <ErrorState message="Campaign data unavailable" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Campaign Management</h2>
          <p className="mt-1 text-sm text-slate-600">Marketing campaigns, conversion results, and AI-assisted recommendations.</p>
        </div>
        <Button onClick={generateRecommendation} disabled={aiLoading}>
          <Bot className="h-4 w-4" />
          {aiLoading ? "Generating" : "Generate AI Campaign Recommendation"}
        </Button>
      </div>

      {error && <ErrorState message={error} />}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total campaigns" value={payload.analytics.totalCampaigns} icon={<Megaphone className="h-5 w-5" />} />
        <StatCard label="Average conversion" value={percent(payload.analytics.averageConversion)} icon={<Percent className="h-5 w-5" />} />
        <StatCard label="Revenue generated" value={currency(payload.analytics.totalRevenue)} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      {aiResult && <AIRecommendationCard recommendation={aiResult} title="Generated Campaign Recommendation" />}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              rows={payload.campaigns}
              columns={[
                { header: "Campaign", cell: (campaign) => campaign.name },
                { header: "Target segment", cell: (campaign) => campaign.target_segment },
                { header: "Channel", cell: (campaign) => campaign.channel },
                { header: "Status", cell: (campaign) => <StatusBadge value={campaign.status} /> },
                { header: "Start", cell: (campaign) => date(campaign.start_date) },
                { header: "End", cell: (campaign) => date(campaign.end_date) },
                { header: "Conversion", cell: (campaign) => percent(campaign.conversion_rate) },
                { header: "Revenue", cell: (campaign) => currency(campaign.revenue_generated) }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payload.analytics.topCampaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-md bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{campaign.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {percent(campaign.conversion_rate)} conversion · {currency(campaign.revenue_generated)} revenue
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
