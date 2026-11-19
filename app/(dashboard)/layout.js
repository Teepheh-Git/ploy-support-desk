import { Suspense } from "react";
import { connection } from "next/server";
import Sidebar from "@/components/layout/sidebar";
import { UserProvider } from "@/components/layout/user-context";
import { CreateTicketProvider } from "@/components/tickets/create-ticket-context";
import { getCurrentUser } from "@/lib/current-user";

// Every page inside (dashboard) gets this shell: a fixed sidebar on desktop
// and the page content on the right. The proxy keeps signed-out visitors out.
// The folder name in parentheses does not appear in the URL.
export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={null}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

// Reads the signed-in user (needs cookies, so it runs at request time) and makes it
// available to the sidebar, header and pages through UserProvider.
async function Shell({ children }) {
  // Marks this shell as request-time so Next.js does not try to prerender it.
  await connection();
  const user = await getCurrentUser();

  return (
    <UserProvider user={user}>
      <CreateTicketProvider>
        <div className="min-h-screen bg-slate-50/60">
          <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white md:block">
            <Sidebar />
          </aside>
          <div className="flex min-h-screen min-w-0 flex-col md:pl-64">{children}</div>
        </div>
      </CreateTicketProvider>
    </UserProvider>
  );
}
