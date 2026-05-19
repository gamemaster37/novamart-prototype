export function LoadingState({ label = "Loading CRM data" }: { label?: string }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-slate-500">
      <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      {label}
    </div>
  );
}
