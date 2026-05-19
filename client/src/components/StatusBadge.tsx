import { cn } from "../utils/cn";

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        (normalized.includes("open") || normalized.includes("high")) && "bg-red-50 text-red-700",
        (normalized.includes("progress") || normalized.includes("medium") || normalized.includes("active")) && "bg-blue-50 text-blue-700",
        (normalized.includes("resolved") || normalized.includes("low") || normalized.includes("completed")) && "bg-emerald-50 text-emerald-700",
        (normalized.includes("paused") || normalized.includes("bronze") || normalized.includes("silver")) && "bg-slate-100 text-slate-700",
        (normalized.includes("gold") || normalized.includes("platinum")) && "bg-amber-50 text-amber-700"
      )}
    >
      {value}
    </span>
  );
}
