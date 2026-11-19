"use client";

import { useState, useTransition } from "react";
import { LogOut, Mail, Pencil, ShieldCheck, UserRound } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import { useCurrentUser } from "@/components/layout/user-context";
import { signOut, updateDisplayName } from "@/app/auth-actions";

// Shows the signed-in user's profile from Supabase Auth, saves the display name and logs out.
export default function SettingsPage() {
  const user = useCurrentUser();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [draftName, setDraftName] = useState(user?.display_name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSave(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    startTransition(async () => {
      const result = await updateDisplayName(draftName);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDisplayName(result.name);
      setIsEditing(false);
      setMessage("Display name updated.");
    });
  }

  const initial = (displayName || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile and account." />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-8">
        {message ? (
          <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <section aria-labelledby="profile-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white sm:flex-row sm:items-center sm:p-6">
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-semibold ring-2 ring-white/40"
            >
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-blue-100">Signed in as</p>
              <p className="truncate text-base font-semibold">{displayName || user?.email}</p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="profile-heading" className="text-base font-semibold text-slate-900">
                Profile
              </h2>
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setError("");
                    setDraftName(displayName);
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </button>
              ) : null}
            </div>

            <dl className="divide-y divide-slate-100 text-sm">
              <div className="flex items-start gap-3 py-3">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Display name</dt>
                  <dd className="mt-0.5 break-words text-slate-900">{displayName || "Not set"}</dd>
                </div>
              </div>
              {user?.full_name ? (
                <div className="flex items-start gap-3 py-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Full name</dt>
                    <dd className="mt-0.5 break-words text-slate-900">{user.full_name}</dd>
                  </div>
                </div>
              ) : null}
              <div className="flex items-start gap-3 py-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
                  <dd className="mt-0.5 break-all text-slate-900">{user?.email}</dd>
                </div>
              </div>
            </dl>

            {isEditing ? (
              <form onSubmit={handleSave} noValidate className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-end">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label htmlFor="display-name" className="text-sm font-medium text-slate-700">
                    New display name
                  </label>
                  <input
                    id="display-name"
                    placeholder="Enter a display name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDraftName(displayName);
                      setIsEditing(false);
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="account-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 id="account-heading" className="text-base font-semibold text-slate-900">
            Session
          </h2>
          <p className="mt-1 mb-4 text-sm text-slate-500">Sign out of the Ploy Support Desk on this device.</p>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
