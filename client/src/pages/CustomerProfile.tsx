import { ArrowLeft, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api/client";
import { AIRecommendationCard } from "../components/AIRecommendationCard";
import { DataTable } from "../components/DataTable";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import type { AiRecommendation, Customer, Interaction, Purchase, SupportCase } from "../types";
import { currency, date } from "../utils/format";

type Profile = {
  customer: Customer;
  purchases: Purchase[];
  interactions: Interaction[];
  supportCases: SupportCase[];
  aiRecommendations: AiRecommendation[];
};

export function CustomerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [aiResult, setAiResult] = useState<AiRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = () => {
    if (!id) return;
    setLoading(true);
    apiGet<Profile>(`/api/customers/${id}`)
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadProfile, [id]);

  const generateRecommendation = async () => {
    if (!profile) return;
    setAiLoading(true);
    setError("");
    try {
      const result = await apiPost<AiRecommendation>("/api/ai/customer-recommendation", { customer_id: profile.customer.id });
      setAiResult(result);
      loadProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI recommendation failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <LoadingState label="Loading customer profile" />;
  if (error && !profile) return <ErrorState message={error} />;
  if (!profile) return <ErrorState message="Customer not found" />;

  const { customer } = profile;

  return (
    <div className="space-y-6">
      <Link to="/customers" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </Link>

      {error && <ErrorState message={error} />}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>{customer.name}</CardTitle>
              <p className="mt-1 text-sm text-slate-500">{customer.email} · {customer.phone}</p>
            </div>
            <Button onClick={generateRecommendation} disabled={aiLoading}>
              <Bot className="h-4 w-4" />
              {aiLoading ? "Generating" : "Generate AI Recommendation"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <Info label="Segment" value={customer.segment} />
              <Info label="Loyalty status" value={<StatusBadge value={customer.loyalty_status} />} />
              <Info label="Preferred category" value={customer.preferred_category} />
              <Info label="Data source" value={customer.data_source} />
              <Info label="Last purchase" value={date(customer.last_purchase_date)} />
              <Info label="Lifetime value" value={currency(customer.lifetime_value)} />
              <Info label="Churn risk" value={<StatusBadge value={customer.churn_risk} />} />
              <Info label="Customer value" value={customer.lifetime_value > 2000 ? "Strategic retention" : "Growth opportunity"} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Value Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-950">{currency(customer.lifetime_value)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {customer.segment} customer with {customer.churn_risk.toLowerCase()} churn risk and strong affinity for {customer.preferred_category}.
            </p>
          </CardContent>
        </Card>
      </div>

      {aiResult && <AIRecommendationCard recommendation={aiResult} title="Generated Customer Recommendation" />}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Purchase History</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              rows={profile.purchases}
              columns={[
                { header: "Product", cell: (purchase) => purchase.product_name },
                { header: "Category", cell: (purchase) => purchase.category },
                { header: "Amount", cell: (purchase) => currency(purchase.amount) },
                { header: "Date", cell: (purchase) => date(purchase.purchase_date) }
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Interactions</CardTitle></CardHeader>
          <CardContent>
            <DataTable
              rows={profile.interactions}
              columns={[
                { header: "Type", cell: (interaction) => interaction.type },
                { header: "Channel", cell: (interaction) => interaction.channel },
                { header: "Summary", cell: (interaction) => interaction.summary },
                { header: "Status", cell: (interaction) => <StatusBadge value={interaction.status} /> }
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Support Cases</CardTitle></CardHeader>
        <CardContent>
          <DataTable
            rows={profile.supportCases}
            columns={[
              { header: "Case", cell: (supportCase) => `#${supportCase.id}` },
              { header: "Title", cell: (supportCase) => supportCase.title },
              { header: "Category", cell: (supportCase) => supportCase.category },
              { header: "Priority", cell: (supportCase) => <StatusBadge value={supportCase.priority} /> },
              { header: "Status", cell: (supportCase) => <StatusBadge value={supportCase.status} /> },
              { header: "Team", cell: (supportCase) => supportCase.assigned_team }
            ]}
          />
        </CardContent>
      </Card>

      {profile.aiRecommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-950">AI Audit Trail</h3>
          {profile.aiRecommendations.map((recommendation, index) => (
            <AIRecommendationCard key={index} recommendation={recommendation} title={`Saved ${recommendation.type.replace(/_/g, " ")}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold text-slate-500">{label}</p>
      <div className="mt-1 text-slate-900">{value}</div>
    </div>
  );
}
