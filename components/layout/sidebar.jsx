"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  Settings,
  LifeBuoy,
  LogOut,
  User,
} from "lucide-react";
import { useCurrentUser } from "@/components/layout/user-context";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { signOut } from "@/app/auth-actions";

// The only five navigation links the PRD asks for.
export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "All Tickets", icon: Ticket },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Sidebar content. Used by the desktop sidebar and the mobile drawer.
// `onNavigate` lets the mobile drawer close itself after a link is tapped.
export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();

  const initials = (user?.full_name || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/25">
          <LifeBuoy className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight text-slate-900">Ploy Support</p>
          <p className="truncate text-xs text-slate-500">Complaint desk</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Main navigation">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu</p>
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          // "All Tickets" stays active on ticket detail pages too.
          const isActive =
            href === "/tickets"
              ? pathname === "/tickets" || pathname.startsWith("/tickets/")
              : pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${
                isActive
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`}
                aria-hidden="true"
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Account footer */}
      <div className="m-3 mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {initials || <User className="h-4 w-4" aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1">
            {user?.full_name ? <p className="truncate text-sm font-medium text-slate-900">{user.full_name}</p> : null}
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsConfirmingLogout(true)}
          className="mt-3 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
        <ConfirmDialog
          open={isConfirmingLogout}
          icon={LogOut}
          title="Log out of Ploy Support Desk?"
          description="You will need to sign in again to access tickets on this device."
          confirmLabel="Log out"
          pendingLabel="Logging out..."
          isPending={isLoggingOut}
          onConfirm={() => startLogout(() => signOut())}
          onCancel={() => setIsConfirmingLogout(false)}
        />
      </div>
    </div>
  );
}
