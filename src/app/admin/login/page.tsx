"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/admin";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form action={action} className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <p className="eyebrow mb-2 text-secondary">Bijali console</p>
        <h1 className="mb-6 text-2xl font-bold">Sign in</h1>
        <label className="mb-4 block text-sm font-semibold">
          Username
          <input className="input mt-1" name="username" autoComplete="username" required />
        </label>
        <label className="mb-6 block text-sm font-semibold">
          Password
          <input
            className="input mt-1"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {state.error ? <p className="mb-4 text-sm text-red-700">{state.error}</p> : null}
        <button
          className="w-full rounded-lg bg-cyan py-3 font-semibold text-white disabled:opacity-60"
          disabled={pending}
        >
          Enter console
        </button>
      </form>
    </main>
  );
}
