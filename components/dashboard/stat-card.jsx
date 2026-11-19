// One statistic card. Used on the dashboard and reports pages.
export default function StatCard({ label, value, icon: Icon, tone = "blue", hint }) {
  const tones = {
    blue: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <p className="truncate text-sm font-medium text-slate-500">{label}</p>
        {Icon ? (
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        ) : null}
      </div>
      <div>
        <p className="text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}
