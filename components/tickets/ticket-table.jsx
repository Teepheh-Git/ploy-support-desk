import Link from "next/link";
import { Eye } from "lucide-react";
import StatusBadge from "./status-badge";
import PriorityBadge from "./priority-badge";

// Formats an ISO date string for display, e.g. "17 Nov 2026".
export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Shows tickets in a table. `showCategory` adds the Category column,
// which only the All Tickets page needs.
export default function TicketTable({ tickets, showCategory = false }) {
  return (
    <>
    {/* Phones: one card per ticket */}
    <ul className="flex flex-col gap-3 md:hidden">
      {tickets.map((ticket) => (
        <li key={ticket.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{ticket.ticket_number}</p>
              <p className="mt-1 line-clamp-2 break-words font-medium leading-snug text-slate-900">{ticket.subject}</p>
              <p className="truncate text-sm text-slate-500">{ticket.customer_name}</p>
            </div>
            <Link
              href={`/tickets/${ticket.id}`}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-violet-50 px-3 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              View
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            {showCategory ? <span className="text-xs text-slate-500">{ticket.category}</span> : null}
            <span className="ml-auto text-xs text-slate-500">{formatDate(ticket.created_at)}</span>
          </div>
        </li>
      ))}
    </ul>

    {/* Larger screens: full table */}
    <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="whitespace-nowrap px-4 py-3">Ticket No.</th>
            <th className="whitespace-nowrap px-4 py-3">Customer</th>
            <th className="px-4 py-3">Subject</th>
            {showCategory ? <th className="whitespace-nowrap px-4 py-3">Category</th> : null}
            <th className="whitespace-nowrap px-4 py-3">Priority</th>
            <th className="whitespace-nowrap px-4 py-3">Status</th>
            <th className="whitespace-nowrap px-4 py-3">Created</th>
            <th className="whitespace-nowrap px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="transition-colors hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                {ticket.ticket_number}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">{ticket.customer_name}</td>
              <td className="px-4 py-3 text-slate-700">{ticket.subject}</td>
              {showCategory ? (
                <td className="whitespace-nowrap px-4 py-3 text-slate-700">{ticket.category}</td>
              ) : null}
              <td className="px-4 py-3">
                <PriorityBadge priority={ticket.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={ticket.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                {formatDate(ticket.created_at)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-violet-50 px-3 font-medium text-violet-700 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
