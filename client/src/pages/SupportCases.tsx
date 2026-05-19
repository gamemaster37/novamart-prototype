import { PlusCircle } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../api/client";
import { AIRecommendationCard } from "../components/AIRecommendationCard";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { SupportCaseCard } from "../components/SupportCaseCard";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import type { AiRecommendation, Customer, SupportCase } from "../types";

export function SupportCases() {
  const [supportCases, setSupportCases] = useState<SupportCase[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiResult, setAiResult] = useState<AiRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoadingId, setAiLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    const [casesPayload, customersPayload] = await Promise.all([
      apiGet<{ supportCases: SupportCase[] }>("/api/support-cases"),
      apiGet<{ customers: Customer[] }>("/api/customers")
    ]);
    setSupportCases(casesPayload.supportCases);
    setCustomers(customersPayload.customers);
    if (!selectedCustomer && customersPayload.customers[0]) {
      setSelectedCustomer(String(customersPayload.customers[0].id));
    }
  };

  useEffect(() => {
    loadData().catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const createCase = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await apiPost<{ supportCase: SupportCase }>("/api/support-cases", {
        customer_id: Number(selectedCustomer),
        title,
        description
      });
      setTitle("");
      setDescription("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create support case");
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setError("");
    try {
      const payload = await apiPatch<{ supportCase: SupportCase }>(`/api/support-cases/${id}`, { status });
      setSupportCases((current) => current.map((item) => (item.id === id ? payload.supportCase : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update support case");
    }
  };

  const generateAi = async (id: number) => {
    setAiLoadingId(id);
    setError("");
    try {
      setAiResult(await apiPost<AiRecommendation>("/api/ai/ticket-response", { support_case_id: id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ticket response generation failed");
    } finally {
      setAiLoadingId(null);
    }
  };

  if (loading) return <LoadingState label="Loading support cases" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Support Case Management</h2>
        <p className="mt-1 text-sm text-slate-600">Create, route, review, and manage customer support cases with AI draft assistance.</p>
      </div>

      {error && <ErrorState message={error} />}

      <Card>
        <CardHeader>
          <CardTitle>Create Support Case</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 lg:grid-cols-[220px_1fr_2fr_auto]" onSubmit={createCase}>
            <select className="rounded-md border-slate-300 text-sm" value={selectedCustomer} onChange={(event) => setSelectedCustomer(event.target.value)}>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select>
            <input
              className="rounded-md border-slate-300 text-sm"
              placeholder="Case title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <textarea
              className="min-h-10 rounded-md border-slate-300 text-sm"
              placeholder="Describe the issue. Routing rules detect billing, delivery, loyalty, technical, and complaint signals."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
            <Button type="submit">
              <PlusCircle className="h-4 w-4" />
              Create
            </Button>
          </form>
        </CardContent>
      </Card>

      {aiResult && <AIRecommendationCard recommendation={aiResult} title="Generated Ticket Response Draft" />}

      <div className="grid gap-4">
        {supportCases.map((supportCase) => (
          <SupportCaseCard
            key={supportCase.id}
            supportCase={supportCase}
            onStatusChange={updateStatus}
            onGenerateAi={generateAi}
            aiLoading={aiLoadingId === supportCase.id}
          />
        ))}
      </div>
    </div>
  );
}
