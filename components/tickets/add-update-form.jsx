"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES } from "@/lib/constants";
import Select from "@/components/ui/select";
import { addUpdate } from "@/lib/tickets";

// Adds a note and can change the status. Saves to Supabase and refreshes the page.
export default function AddUpdateForm({ ticket }) {
  const router = useRouter();
  const currentStatus = ticket.status;
  const [note, setNote] = useState("");
  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!note.trim() && status === currentStatus) {
      setError("Write a note or choose a new status.");
      setMessage("");
      return;
    }
    setError("");
    setMessage("");
    setIsSaving(true);
    try {
      await addUpdate(ticket, { message: note.trim(), newStatus: status });
      setNote("");
      setMessage("Update saved.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="update-note" className="text-sm font-medium text-slate-700">
          Add Update / Note
        </label>
        <textarea
          id="update-note"
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Write what happened or what you did next"
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="update-status" className="text-sm font-medium text-slate-700">
          Change Status
        </label>
        <Select id="update-status" label="Change Status" value={status} onChange={setStatus} options={STATUSES} />
      </div>

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
      {message ? <p role="status" className="text-xs text-emerald-700">{message}</p> : null}

      <button type="submit" disabled={isSaving} className="self-start rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 disabled:opacity-60">
        {isSaving ? "Saving..." : "Save Update"}
      </button>
    </form>
  );
}
