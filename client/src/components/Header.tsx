import { Database, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-700">NovaMart AI CRM</p>
          <h1 className="text-xl font-bold text-slate-950">Retail customer intelligence workspace</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5">
            <Database className="h-3.5 w-3.5" />
            SQLite demo data
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            Backend DeepSeek
          </span>
        </div>
      </div>
    </header>
  );
}
