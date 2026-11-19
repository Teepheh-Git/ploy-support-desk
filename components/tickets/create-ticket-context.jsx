"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import TicketForm from "@/components/tickets/ticket-form";

// Lets any button in the dashboard open the "New Ticket" form as a modal.
const CreateTicketContext = createContext(null);

export function CreateTicketProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ openModal }), [openModal]);

  return (
    <CreateTicketContext.Provider value={value}>
      {children}
      {isOpen ? <CreateTicketModal onClose={closeModal} /> : null}
    </CreateTicketContext.Provider>
  );
}

export function useCreateTicket() {
  const context = useContext(CreateTicketContext);
  if (!context) throw new Error("useCreateTicket must be used inside CreateTicketProvider");
  return context;
}

// The dialog shell. Closes on Escape, the close button, or a click on the backdrop.
function CreateTicketModal({ onClose }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-ticket-title"
        className="my-8 w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl sm:p-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="create-ticket-title" className="text-lg font-semibold text-slate-900">
              New Ticket
            </h2>
            <p className="mt-1 text-sm text-slate-500">Log a customer complaint received by WhatsApp, email or phone. Fields marked * are required.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <TicketForm submitLabel="Create Ticket" onCancel={onClose} onSaved={onClose} />
      </div>
    </div>
  );
}
