import { formatDate } from "./ticket-table";

// Activity History: one line per update (creation, status change, note, resolution).
export default function ActivityList({ updates }) {
  if (updates.length === 0) {
    return <p className="text-sm text-slate-500">No activity recorded yet.</p>;
  }

  return (
    <ol className="relative flex flex-col gap-5 before:absolute before:inset-y-1 before:left-[5px] before:w-px before:bg-slate-200">
      {updates.map((update) => (
        <li key={update.id} className="relative flex gap-4 pl-6">
          <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-violet-500 bg-white" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm leading-relaxed text-slate-900">{update.message}</p>
            <p className="mt-0.5 text-xs text-slate-500">{formatDate(update.created_at)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
