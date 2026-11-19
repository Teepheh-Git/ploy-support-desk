"use client";

import { User } from "lucide-react";
import MobileNav from "./mobile-nav";
import { useCurrentUser } from "@/components/layout/user-context";

// Top bar of every dashboard page: menu button (mobile), page title, optional action and admin avatar.
export default function PageHeader({ title, subtitle, action }) {
  const user = useCurrentUser();

  // Initials shown in the avatar circle, e.g. "Ada Okafor" -> "AO".
  const initials = (user?.full_name || "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex min-h-18 items-center justify-between gap-3 px-4 py-3 sm:gap-4 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <MobileNav />
          <div className="min-w-0">
            <p className="hidden text-xs font-semibold uppercase tracking-wider text-violet-600 md:block">Ploy Support Desk</p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 md:text-xl">{title}</h1>
            {subtitle ? <p className="hidden truncate text-sm text-slate-500 sm:block">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {action}
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-sm font-semibold text-white lg:hidden"
            aria-label={user?.full_name ? `Signed in as ${user.full_name}` : "Signed-in account"}
            role="img"
          >
            {initials || <User className="h-4 w-4" aria-hidden="true" />}
          </div>
        </div>
      </div>
    </header>
  );
}
