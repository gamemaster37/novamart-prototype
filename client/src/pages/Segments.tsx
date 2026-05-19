import { UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { apiGet } from "../api/client";
import { ChartCard } from "../components/ChartCard";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import type { Segment } from "../types";

const colors = ["#2563eb", "#0f766e", "#dc2626", "#f59e0b", "#64748b"];

export function Segments() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ segments: Segment[] }>("/api/segments")
      .then((payload) => setSegments(payload.segments))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading segments" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Customer Segments</h2>
        <p className="mt-1 text-sm text-slate-600">Presentation-friendly segmentation rules for targeted campaigns and service prioritisation.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {segments.map((segment) => (
          <Card key={segment.id}>
            <CardContent>
              <div className="mb-4 inline-flex rounded-md bg-blue-50 p-3 text-blue-700">
                <UsersRound className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-950">{segment.name}</h3>
              <p className="mt-2 text-3xl font-bold text-blue-700">{segment.customer_count}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{segment.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ChartCard title="Segment Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segments.map((segment) => ({ name: segment.name, value: segment.customer_count }))} dataKey="value" nameKey="name" outerRadius={95} label>
                {segments.map((segment, index) => (
                  <Cell key={segment.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <CardHeader>
            <CardTitle>Segmentation Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {segments.map((segment) => (
              <div key={segment.id} className="rounded-md bg-slate-50 p-3">
                <p className="font-semibold text-slate-900">{segment.name}</p>
                <p className="mt-1 text-sm text-slate-600">{segment.rule_description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
