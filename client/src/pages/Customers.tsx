import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../api/client";
import { DataTable } from "../components/DataTable";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { StatusBadge } from "../components/StatusBadge";
import type { Customer } from "../types";
import { currency, date } from "../utils/format";

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("All");
  const [risk, setRisk] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ customers: Customer[] }>("/api/customers")
      .then((payload) => setCustomers(payload.customers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const segments = useMemo(() => ["All", ...Array.from(new Set(customers.map((customer) => customer.segment)))], [customers]);
  const risks = ["All", "Low", "Medium", "High"];
  const filtered = customers.filter((customer) => {
    const text = `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (segment === "All" || customer.segment === segment) && (risk === "All" || customer.churn_risk === risk);
  });

  if (loading) return <LoadingState label="Loading customers" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Customers</h2>
        <p className="mt-1 text-sm text-slate-600">Centralised customer records from POS, e-commerce, loyalty, and marketing sources.</p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <label className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-full rounded-md border-slate-300 pl-9 text-sm"
            placeholder="Search by name, email, or phone"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <select className="rounded-md border-slate-300 text-sm" value={segment} onChange={(event) => setSegment(event.target.value)}>
          {segments.map((value) => <option key={value}>{value}</option>)}
        </select>
        <select className="rounded-md border-slate-300 text-sm" value={risk} onChange={(event) => setRisk(event.target.value)}>
          {risks.map((value) => <option key={value}>{value}</option>)}
        </select>
      </div>

      <DataTable
        rows={filtered}
        columns={[
          { header: "ID", cell: (customer) => `#${customer.id}` },
          { header: "Name", cell: (customer) => <Link className="font-semibold text-blue-700 hover:underline" to={`/customers/${customer.id}`}>{customer.name}</Link> },
          { header: "Email", cell: (customer) => customer.email },
          { header: "Phone", cell: (customer) => customer.phone },
          { header: "Segment", cell: (customer) => customer.segment },
          { header: "Loyalty", cell: (customer) => <StatusBadge value={customer.loyalty_status} /> },
          { header: "Preferred category", cell: (customer) => customer.preferred_category },
          { header: "Last purchase", cell: (customer) => date(customer.last_purchase_date) },
          { header: "Lifetime value", cell: (customer) => currency(customer.lifetime_value) },
          { header: "Churn risk", cell: (customer) => <StatusBadge value={customer.churn_risk} /> },
          { header: "Data source", cell: (customer) => customer.data_source }
        ]}
      />
    </div>
  );
}
