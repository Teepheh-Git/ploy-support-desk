"use client";

import { Plus } from "lucide-react";
import { useCreateTicket } from "@/components/tickets/create-ticket-context";

// Opens the New Ticket modal. Used in page headers and empty states.
export default function CreateTicketButton({ className = "" }) {
  const { openModal } = useCreateTicket();

  return (
    <button
      type="button"
      onClick={openModal}
      className={`inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${className}`}
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Create Ticket</span>
      <span className="sm:hidden">New</span>
    </button>
  );
}
