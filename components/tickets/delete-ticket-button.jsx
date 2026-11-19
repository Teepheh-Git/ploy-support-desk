"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteTicket } from "@/lib/tickets";
import ConfirmDialog from "@/components/ui/confirm-dialog";

// Delete button with a confirmation step. Deletes the ticket in Supabase, then returns to All Tickets.
export default function DeleteTicketButton({ ticketId, ticketNumber }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setIsDeleting(true);
    setError("");
    try {
      await deleteTicket(ticketId);
      router.push("/tickets");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 shadow-sm transition-colors hover:bg-rose-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete Ticket
      </button>

      <ConfirmDialog
        open={isOpen}
        icon={Trash2}
        title={`Delete ${ticketNumber}?`}
        description="This permanently removes the ticket and its activity history. This cannot be undone."
        confirmLabel="Delete Ticket"
        pendingLabel="Deleting..."
        isPending={isDeleting}
        error={error}
        onConfirm={handleDelete}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
