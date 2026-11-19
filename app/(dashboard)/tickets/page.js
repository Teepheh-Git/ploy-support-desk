"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import TicketTable from "@/components/tickets/ticket-table";
import TicketFilters from "@/components/tickets/ticket-filters";
import EmptyState from "@/components/tickets/empty-state";
import CreateTicketButton from "@/components/tickets/create-ticket-button";
import { Download } from "lucide-react";
import { listTickets } from "@/lib/tickets";

const NO_FILTERS = { search: "", status: "", priority: "", category: "" };

const CSV_COLUMNS = [
  ["ticket_number", "Ticket Number"],
  ["subject", "Subject"],
  ["customer_name", "Customer Name"],
  ["customer_email", "Email"],
  ["customer_phone", "Phone"],
  ["category", "Category"],
  ["priority", "Priority"],
  ["status", "Status"],
  ["source", "Source"],
  ["description", "Description"],
  ["created_at", "Date Created"],
  ["updated_at", "Last Updated"],
];

// Quotes one CSV cell and doubles any embedded quotes.
function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

// Downloads the given tickets as a CSV file built in the browser.
function downloadTicketsCsv(tickets) {
  const header = CSV_COLUMNS.map(([, label]) => csvCell(label)).join(",");
  const rows = tickets.map((ticket) => CSV_COLUMNS.map(([key]) => csvCell(ticket[key])).join(","));
  const blob = new Blob([[header, ...rows].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tickets-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadTicketsCsv(visibleTickets)}
              disabled={visibleTickets.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Export CSV
            </button>
            <CreateTicketButton />
          </div>
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
            action={mockTickets.length === 0 ? <CreateTicketButton /> : undefined}
          />
        ) : (
          <TicketTable tickets={visibleTickets} showCategory />
        )}
      </main>
    </>
  );
}
