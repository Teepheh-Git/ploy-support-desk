"use client";

import { useEffect, useId } from "react";

// Custom confirmation dialog used in place of the browser's native confirm().
// Closes on Escape or Cancel. Pass `tone="danger"` for destructive actions.
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pendingLabel,
  icon: Icon,
  tone = "danger",
  isPending = false,
  error = "",
  onConfirm,
  onCancel,
}) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKey(event) {
      if (event.key === "Escape" && !isPending) onCancel();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, isPending, onCancel]);

  if (!open) return null;

  const isDanger = tone === "danger";
  const iconWrap = isDanger ? "bg-rose-50" : "bg-violet-50";
  const iconColour = isDanger ? "text-rose-600" : "text-violet-600";
  const confirmClass = isDanger
    ? "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
    : "bg-violet-600 shadow-violet-600/20 hover:bg-violet-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        {Icon ? (
          <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconWrap}`}>
            <Icon className={`h-5 w-5 ${iconColour}`} aria-hidden="true" />
          </div>
        ) : null}
        <h2 id={titleId} className="text-base font-semibold text-slate-900">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
        {error ? (
          <p role="alert" className="mt-3 text-sm text-rose-600">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors disabled:opacity-60 ${confirmClass}`}
          >
            {isPending ? pendingLabel || "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
