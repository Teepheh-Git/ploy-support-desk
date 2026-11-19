// Coloured badge for a ticket status. Colours are kept to a minimum so
// the table stays easy to scan.
const STATUS_STYLES = {
  Open: "bg-violet-50 text-violet-700 ring-violet-200",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || "bg-slate-100 text-slate-700 ring-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
  );
}
