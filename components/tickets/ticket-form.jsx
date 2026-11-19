"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTicket, updateTicket } from "@/lib/tickets";
import { CATEGORIES, PRIORITIES, SOURCES } from "@/lib/constants";
import Select from "@/components/ui/select";

const EMPTY_FORM = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  subject: "",
  description: "",
  category: "",
  priority: "",
  source: "",
};

// Used for both "New Ticket" and "Edit Ticket". `initialValues` pre-fills the edit form.
// Without ticketId it creates a ticket; with ticketId it updates that ticket. Both save to Supabase.
export default function TicketForm({ ticketId, initialValues, cancelHref, submitLabel }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const newErrors = {};
    if (!form.customer_name.trim()) newErrors.customer_name = "Customer name is required.";
    if (form.customer_email && !/^\S+@\S+\.\S+$/.test(form.customer_email)) {
      newErrors.customer_email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) newErrors.subject = "Complaint subject is required.";
    if (!form.description.trim()) newErrors.description = "Complaint description is required.";
    if (!form.category) newErrors.category = "Please choose a category.";
    if (!form.priority) newErrors.priority = "Please choose a priority.";
    if (!form.source) newErrors.source = "Please choose a source.";
    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSaveError("");
    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    try {
      const payload = { ...form, customer_name: form.customer_name.trim(), subject: form.subject.trim(), description: form.description.trim() };
      if (ticketId) {
        await updateTicket(ticketId, payload);
        router.push(`/tickets/${ticketId}`);
      } else {
        const ticket = await createTicket(payload);
        router.push(`/tickets/${ticket.id}`);
      }
      router.refresh();
    } catch (err) {
      setSaveError(err.message);
      setIsSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      {saveError ? (
        <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {saveError}
        </p>
      ) : null}

      <fieldset className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <legend className="mb-1 text-sm font-semibold text-slate-900">Customer Information</legend>

        <Field label="Customer Name" required htmlFor="customer_name" error={errors.customer_name}>
          <input id="customer_name" placeholder="e.g. Jane Doe" value={form.customer_name} onChange={(e) => updateField("customer_name", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Email Address" htmlFor="customer_email" error={errors.customer_email}>
          <input id="customer_email" type="email" placeholder="name@example.com" value={form.customer_email} onChange={(e) => updateField("customer_email", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Phone Number" htmlFor="customer_phone">
          <input id="customer_phone" type="tel" placeholder="e.g. +234 800 000 0000" value={form.customer_phone} onChange={(e) => updateField("customer_phone", e.target.value)} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <legend className="mb-1 text-sm font-semibold text-slate-900">Complaint Information</legend>

        <Field label="Complaint Subject" required htmlFor="subject" error={errors.subject} wide>
          <input id="subject" placeholder="A short summary of the complaint" value={form.subject} onChange={(e) => updateField("subject", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Complaint Description" required htmlFor="description" error={errors.description} wide>
          <textarea id="description" rows={5} placeholder="What the customer reported, in their own words where possible" value={form.description} onChange={(e) => updateField("description", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Category" required htmlFor="category" error={errors.category}>
          <Select id="category" label="Category" value={form.category} onChange={(value) => updateField("category", value)} options={CATEGORIES} placeholder="Select a category" />
        </Field>

        <Field label="Priority" required htmlFor="priority" error={errors.priority}>
          <Select id="priority" label="Priority" value={form.priority} onChange={(value) => updateField("priority", value)} options={PRIORITIES} placeholder="Select a priority" />
        </Field>

        <Field label="Source of Complaint" required htmlFor="source" error={errors.source}>
          <Select id="source" label="Source of Complaint" value={form.source} onChange={(value) => updateField("source", value)} options={SOURCES} placeholder="Select a source" />
        </Field>
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
        <Link href={cancelHref} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
          Cancel
        </Link>
        <button type="submit" disabled={isSaving} className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 disabled:opacity-60">
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

// One labelled form row with an optional error message.
function Field({ label, htmlFor, required, error, wide, children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
