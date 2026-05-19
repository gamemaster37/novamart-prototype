import { CheckCircle2 } from "lucide-react";

export function PrivacyChecklist({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">{item}</span>
        </div>
      ))}
    </div>
  );
}
