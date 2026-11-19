import Link from "next/link";
import { Inbox } from "lucide-react";

// Shown instead of a table when there is nothing to list.
export default function EmptyState({ title, message, actionHref, actionLabel }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
        <Inbox className="h-7 w-7 text-violet-600" aria-hidden="true" />
      </div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      {actionHref ? (
        <Link
          href={actionHref}
          className="mt-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
