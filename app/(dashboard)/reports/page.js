import { connection } from "next/server";
import PageHeader from "@/components/layout/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { CATEGORIES, STATUSES } from "@/lib/constants";
import { listTicketsOnServer } from "@/lib/tickets-server";

// Dot colours for each status, so the bars read at a glance.
const STATUS_DOT = {
  Open: "bg-amber-500",
  "In Progress": "bg-violet-500",
  Resolved: "bg-emerald-500",
};

// Counts how many tickets have each value of one field.
function countBy(tickets, field, values) {
  return values.map((value) => ({
    label: value,
    count: tickets.filter((ticket) => ticket[field] === value).length,
  }));
}

// Turns a count into a whole-number percentage of the total, avoiding divide-by-zero.
function percent(count, total) {
  return total === 0 ? 0 : Math.round((count / total) * 100);
}

export default async function ReportsPage() {
  // Signed-in data is read per request, so Next.js must not prerender this page.
  await connection();
  const tickets = await listTicketsOnServer();
  const total = tickets.length;
  const byStatus = countBy(tickets, "status", STATUSES);
  const byCategory = countBy(tickets, "category", CATEGORIES);
  const statusCount = (status) => byStatus.find((item) => item.label === status).count;

  return (
    <>
      <PageHeader title="Reports" subtitle="A summary of every complaint on record" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
        <section aria-label="Key figures" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Complaints" value={total} />
          <StatCard label="Resolved" value={statusCount("Resolved")} />
          <StatCard label="Open" value={statusCount("Open")} />
          <StatCard label="In Progress" value={statusCount("In Progress")} />
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section aria-labelledby="status-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 id="status-heading" className="text-base font-semibold text-slate-900">Complaints by Status</h2>
              <p className="text-sm text-slate-500">Share of all complaints in each stage</p>
            </div>
            <div className="flex flex-col gap-5">
              {byStatus.map((item) => {
                const share = percent(item.count, total);
                return (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[item.label] ?? "bg-slate-400"}`} aria-hidden="true" />
                        {item.label}
                      </span>
                      <span className="text-slate-500">
                        <span className="font-semibold text-slate-900">{item.count}</span> · {share}%
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
                      role="meter"
                      aria-label={`${item.label} share`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={share}
                    >
                      <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="category-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4">
              <h2 id="category-heading" className="text-base font-semibold text-slate-900">Complaints by Category</h2>
              <p className="text-sm text-slate-500">Where complaints are coming from</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-200 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="py-2.5 font-medium">Category</th>
                    <th scope="col" className="py-2.5 text-right font-medium">Share</th>
                    <th scope="col" className="py-2.5 text-right font-medium">Complaints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {byCategory.map((item) => (
                    <tr key={item.label} className="transition-colors hover:bg-slate-50">
                      <td className="py-3 text-slate-700">{item.label}</td>
                      <td className="py-3 text-right text-slate-500">{percent(item.count, total)}%</td>
                      <td className="py-3 text-right font-semibold text-slate-900">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
