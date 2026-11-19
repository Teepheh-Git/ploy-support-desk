"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import TicketTable from "@/components/tickets/ticket-table";
import TicketFilters from "@/components/tickets/ticket-filters";
import EmptyState from "@/components/tickets/empty-state";
import { listTickets } from "@/lib/tickets";

const NO_FILTERS = { search: "", status: "", priority: "", category: "" };

// Loads every ticket from Supabase, then filters the list in the browser.
export default function AllTicketsPage() {
  const [filters, setFilters] = useState(NO_FILTERS);
  const [mockTickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listTickets()
      .then(setTickets)
      .catch((err) => setLoadError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const search = filters.search.trim().toLowerCase();
  const visibleTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      !search ||
      ticket.ticket_number.toLowerCase().includes(search) ||
      ticket.customer_name.toLowerCase().includes(search) ||
      ticket.subject.toLowerCase().includes(search);
    const matchesStatus = !filters.status || ticket.status === filters.status;
    const matchesPriority = !filters.priority || ticket.priority === filters.priority;
    const matchesCategory = !filters.category || ticket.category === filters.category;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <>
      <PageHeader
        title="All Tickets"
        subtitle={`${visibleTickets.length} of ${mockTickets.length} tickets shown`}
        action={
          <Link href="/tickets/new" className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Create Ticket</span>
            <span className="sm:hidden">New</span>
          </Link>
        }
      />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
        <section aria-label="Search and filter tickets">
          <TicketFilters filters={filters} onChange={setFilters} />
        </section>

        {loadError ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{loadError}</p>
        ) : isLoading ? (
          <p role="status" className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">Loading tickets...</p>
        ) : visibleTickets.length === 0 ? (
          <EmptyState
            title={mockTickets.length === 0 ? "No tickets yet" : "No matching tickets"}
            message={mockTickets.length === 0 ? "Register the first customer complaint to start tracking it." : "Try a different search or clear the filters."}
            actionHref={mockTickets.length === 0 ? "/tickets/new" : undefined}
            actionLabel="Create Ticket"
          />
        ) : (
          <TicketTable tickets={visibleTickets} showCategory />
        )}
      </main>
    </>
  );
}
