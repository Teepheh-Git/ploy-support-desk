import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Pencil } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import StatusBadge from "@/components/tickets/status-badge";
import PriorityBadge from "@/components/tickets/priority-badge";
import ActivityList from "@/components/tickets/activity-list";
import AddUpdateForm from "@/components/tickets/add-update-form";
import ResolveButton from "@/components/tickets/resolve-button";
import DeleteTicketButton from "@/components/tickets/delete-ticket-button";
import { formatDate } from "@/components/tickets/ticket-table";
import { getTicketOnServer, listUpdatesOnServer } from "@/lib/tickets-server";


// Placeholder shown while the ticket loads.
function TicketSkeleton() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8" aria-busy="true">
      <div className="h-12 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
      <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm" />
    </main>
  );
}

// In Next.js 16, dynamic route params arrive as a Promise, so they must be awaited.
export default function TicketDetailsPage({ params }) {
  return (
    <Suspense fallback={<TicketSkeleton />}>
      <TicketContent params={params} />
    </Suspense>
  );
}

// Reads the signed-in ticket on each request, so Next.js must not prerender this part.
async function TicketContent({ params }) {
  await connection();
  const { id } = await params;
  const ticket = await getTicketOnServer(id);

  if (!ticket) {
    notFound();
  }

  const updates = await listUpdatesOnServer(id);

  return (
    <>
      <PageHeader title={ticket.ticket_number} subtitle={ticket.subject} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <Link href="/tickets" className="text-sm font-medium text-violet-600 hover:text-violet-800">
            ← Back to All Tickets
          </Link>
          <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <Link href={`/tickets/${id}/edit`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Edit Ticket
            </Link>
            <ResolveButton ticket={ticket} />
            <DeleteTicketButton ticketId={ticket.id} ticketNumber={ticket.ticket_number} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Ticket Details</h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Ticket Number" value={ticket.ticket_number} />
                <Detail label="Subject" value={ticket.subject} />
                <Detail label="Category" value={ticket.category} />
                <Detail label="Source" value={ticket.source} />
                <Detail label="Priority" value={<PriorityBadge priority={ticket.priority} />} />
                <Detail label="Current Status" value={<StatusBadge status={ticket.status} />} />
                <Detail label="Date Created" value={formatDate(ticket.created_at)} />
                <Detail label="Last Updated" value={formatDate(ticket.updated_at)} />
              </dl>
              <div className="mt-6">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Description</dt>
                <dd className="mt-1 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-900">{ticket.description}</dd>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Activity History</h2>
              <ActivityList updates={updates} />
            </section>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Customer Details</h2>
              <dl className="flex flex-col gap-4">
                <Detail label="Customer Name" value={ticket.customer_name} />
                <Detail label="Email" value={ticket.customer_email || "Not provided"} />
                <Detail label="Phone Number" value={ticket.customer_phone || "Not provided"} />
              </dl>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-4 text-base font-semibold text-slate-900">Add Update / Note</h2>
              <AddUpdateForm ticket={ticket} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

// One label/value pair in the details lists.
function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value}</dd>
    </div>
  );
}
