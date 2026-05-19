import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/Card";

export function StatCard({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="rounded-md bg-blue-50 p-3 text-blue-700">{icon}</div>
      </CardContent>
    </Card>
  );
}
