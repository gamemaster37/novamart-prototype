import { Bot, Save } from "lucide-react";
import type { SupportCase } from "../types";
import { date } from "../utils/format";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { StatusBadge } from "./StatusBadge";

const statuses = ["Open", "In progress", "Resolved"];

export function SupportCaseCard({
  supportCase,
  onStatusChange,
  onGenerateAi,
  aiLoading
}: {
  supportCase: SupportCase;
  onStatusChange: (id: number, status: string) => void;
  onGenerateAi: (id: number) => void;
  aiLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>#{supportCase.id} {supportCase.title}</CardTitle>
          <p className="mt-1 text-sm text-slate-500">{supportCase.customer_name} · {date(supportCase.created_at)}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <StatusBadge value={supportCase.priority} />
          <StatusBadge value={supportCase.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-slate-700">{supportCase.description}</p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold text-slate-500">Category</p>
            <p className="text-slate-900">{supportCase.category}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-500">Assigned team</p>
            <p className="text-slate-900">{supportCase.assigned_team}</p>
          </div>
          <div>
            <p className="font-semibold text-slate-500">Customer segment</p>
            <p className="text-slate-900">{supportCase.customer_segment}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            className="rounded-md border-slate-300 text-sm"
            value={supportCase.status}
            onChange={(event) => onStatusChange(supportCase.id, event.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => onStatusChange(supportCase.id, supportCase.status)}>
            <Save className="h-4 w-4" />
            Save status
          </Button>
          <Button onClick={() => onGenerateAi(supportCase.id)} disabled={aiLoading}>
            <Bot className="h-4 w-4" />
            {aiLoading ? "Generating" : "Generate AI Ticket Response"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
