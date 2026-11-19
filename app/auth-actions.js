"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Signs in with Supabase Auth. Returns an error message on failure; redirects on success.
export async function signIn(_previousState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: "Incorrect email or password." };
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Saves the full name and display name in the user's Supabase Auth metadata.
export async function updateProfile({ fullName, displayName }) {
  const full = String(fullName || "").trim();
  const display = String(displayName || "").trim();
  if (!full) return { error: "Full name cannot be empty." };
  if (!display) return { error: "Display name cannot be empty." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ data: { full_name: full, display_name: display } });
  if (error) return { error: "Could not save your profile. Please try again." };
  return { fullName: full, displayName: display };
}
