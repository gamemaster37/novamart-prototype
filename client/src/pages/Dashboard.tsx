import { Activity, BadgePercent, LifeBuoy, TrendingUp, UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { apiGet } from "../api/client";
import { ChartCard } from "../components/ChartCard";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatCard } from "../components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import type { DashboardData } from "../types";
import { currency, percent } from "../utils/format";

const colors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#64748b", "#0891b2"];

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<DashboardData>("/api/dashboard").then(setData).catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Loading dashboard" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Central CRM view across customer value, campaigns, and support operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total customers" value={data.kpis.totalCustomers} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Active customers" value={data.kpis.activeCustomers} icon={<UserCheck className="h-5 w-5" />} />
        <StatCard label="Monthly sales" value={currency(data.kpis.monthlySales)} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard label="Retention rate" value={percent(data.kpis.retentionRate)} icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Open support cases" value={data.kpis.openSupportCases} icon={<LifeBuoy className="h-5 w-5" />} />
        <StatCard label="Campaign conversion" value={percent(data.kpis.campaignConversionRate)} icon={<BadgePercent className="h-5 w-5" />} />
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle>AI Insight Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-blue-950">{data.insightSummary}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Sales Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.charts.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => currency(Number(value))} />
              <Line dataKey="sales" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Customer Segment Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.charts.segmentBreakdown} dataKey="value" nameKey="name" outerRadius={95} label>
                {data.charts.segmentBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Campaign Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.charts.campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip formatter={(value, name) => (name === "revenue_generated" ? currency(Number(value)) : percent(Number(value)))} />
              <Bar dataKey="conversion_rate" fill="#2563eb" name="Conversion" />
              <Bar dataKey="revenue_generated" fill="#16a34a" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Support Case Status">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.charts.supportStatusBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
