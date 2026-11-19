import PageHeader from "@/components/layout/page-header";
import TicketForm from "@/components/tickets/ticket-form";

// Manual entry form for a complaint. Saving to Supabase is added in Stage 5.
export default function NewTicketPage() {
  return (
    <>
      <PageHeader title="New Ticket" subtitle="Log a customer complaint" />
      <main className="mx-auto w-full max-w-3xl p-4 md:p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <p className="mb-6 rounded-lg bg-violet-50 px-4 py-3 text-sm text-violet-900">
            Register a complaint received by WhatsApp, email or phone. Fields marked * are required.
          </p>
          <TicketForm cancelHref="/tickets" submitLabel="Create Ticket" />
        </div>
      </main>
    </>
  );
}
