"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LifeBuoy } from "lucide-react";
import { signIn } from "@/app/auth-actions";

// Signs in through Supabase Auth. On success the server redirects to the dashboard.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, formAction, isPending] = useActionState(signIn, {});

  function handleSubmit(event) {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) event.preventDefault();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-center text-white sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 ring-2 ring-white/40">
            <LifeBuoy className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Ploy Support Desk</h1>
            <p className="mt-1 text-sm text-violet-100">Sign in to manage customer complaints.</p>
          </div>
        </div>

        <form action={formAction} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
            {errors.email ? (
              <p id="email-error" className="text-xs text-rose-600">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
                className="w-full rounded-lg border border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p id="password-error" className="text-xs text-rose-600">
                {errors.password}
              </p>
            ) : null}
          </div>

          {state.error ? (
            <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {state.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 disabled:opacity-60"
          >
            {isPending ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
