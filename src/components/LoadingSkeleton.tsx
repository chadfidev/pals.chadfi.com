export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-5 w-3/5 rounded-lg bg-slate-700/40" />
      <div className="h-5 w-full rounded-lg bg-slate-700/40" />
      <div className="h-5 w-4/5 rounded-lg bg-slate-700/40" />
    </div>
  );
}
