import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { CircleDot, Clock, CheckCircle2, Ticket, Plus, ArrowRight } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/dashboard/stat-card";
import TicketTable from "@/components/tickets/ticket-table";
import EmptyState from "@/components/tickets/empty-state";
import { getCurrentUser } from "@/lib/current-user";
import { listTicketsOnServer } from "@/lib/tickets-server";


export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        action={
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Create Ticket</span>
            <span className="sm:hidden">New</span>
          </Link>
        }
      />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}

// Placeholder shown while the signed-in data loads, so the page header appears straight away.
function DashboardSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8" aria-busy="true">
      <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
    </main>
  );
}

// Reads signed-in data on each request and renders the dashboard body.
async function DashboardContent() {
  await connection();
  const [user, tickets] = await Promise.all([getCurrentUser(), listTicketsOnServer()]);
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const inProgress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;

  // Share of each status, used for the breakdown bar (0 when there are no tickets).
  const share = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

  // Newest first, keep only five.
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const segments = [
    { label: "Open", count: open, bar: "bg-amber-400", dot: "bg-amber-400" },
    { label: "In Progress", count: inProgress, bar: "bg-violet-500", dot: "bg-violet-500" },
    { label: "Resolved", count: resolved, bar: "bg-emerald-500", dot: "bg-emerald-500" },
  ];

  return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
        <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:grid-cols-5">
          <div className="flex flex-col justify-between gap-4 lg:col-span-2">
            <div>
              <p className="text-sm font-medium text-violet-600">Welcome back{user?.display_name ? `, ${user.display_name}` : ""}</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {open === 0 ? "No open tickets right now" : `${open} open ${open === 1 ? "ticket" : "tickets"} to review`}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Pick up open complaints, update progress and mark them resolved.
              </p>
            </div>
            <Link
              href="/tickets"
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              View all tickets
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="flex flex-col justify-center gap-4 lg:col-span-3">
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-slate-900">Status breakdown</p>
              <p className="text-slate-500">{total} total</p>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`Open ${open}, in progress ${inProgress}, resolved ${resolved}`}>
              {segments.map((s) => (
                <div key={s.label} className={`${s.bar} h-full`} style={{ width: `${share(s.count)}%` }} />
              ))}
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {segments.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
                  <span className="text-sm text-slate-600">{s.label}</span>
                  <span className="ml-auto text-sm font-semibold text-slate-900">{s.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Tickets" value={total} icon={Ticket} tone="blue" hint="All complaints logged" />
          <StatCard label="Open Tickets" value={open} icon={CircleDot} tone="amber" hint={`${share(open)}% of total`} />
          <StatCard label="In Progress" value={inProgress} icon={Clock} tone="blue" hint={`${share(inProgress)}% of total`} />
          <StatCard label="Resolved Tickets" value={resolved} icon={CheckCircle2} tone="emerald" hint={`${share(resolved)}% of total`} />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Tickets</h2>
              <p className="text-sm text-slate-500">The five latest complaints.</p>
            </div>
            <Link href="/tickets" className="text-sm font-medium text-violet-600 hover:text-violet-800">
              See all
            </Link>
          </div>
          {recentTickets.length === 0 ? (
            <EmptyState title="No tickets yet" message="Register the first customer complaint to see it here." actionHref="/tickets/new" actionLabel="Create Ticket" />
          ) : (
            <TicketTable tickets={recentTickets} />
          )}
        </section>
      </main>
  );
}
