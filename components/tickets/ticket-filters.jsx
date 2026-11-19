"use client";

import { Search } from "lucide-react";
import { CATEGORIES, PRIORITIES, STATUSES } from "@/lib/constants";
import Select from "@/components/ui/select";

// Search and filter controls. The parent page holds the values and does the filtering,
// so this component only displays inputs and reports changes.
export default function TicketFilters({ filters, onChange }) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search tickets"
          placeholder="Search by ticket number, customer or subject"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:shrink-0">
        <Select label="Filter by status" value={filters.status} onChange={(value) => update("status", value)} options={STATUSES} placeholder="All statuses" />

        <Select label="Filter by priority" value={filters.priority} onChange={(value) => update("priority", value)} options={PRIORITIES} placeholder="All priorities" />

        <Select label="Filter by category" value={filters.category} onChange={(value) => update("category", value)} options={CATEGORIES} placeholder="All categories" />
      </div>
    </div>
  );
}
