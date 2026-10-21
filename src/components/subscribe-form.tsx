"use client";

import { useActionState } from "react";
import Link from "next/link";
import { subscribe } from "@/app/actions/public";
import { Icon } from "@/components/icon";

export function SubscribeForm({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  const [state, action, pending] = useActionState(subscribe, { ok: false, message: "" });

  return (
    <div className="mb-16 flex flex-col items-center justify-between gap-6 rounded-xl bg-navy-3 p-8 lg:flex-row">
      <div className="max-w-xl">
        <span className="eyebrow mb-1 block text-sky">{eyebrow}</span>
        <h3 className="mb-2 text-2xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{body}</p>
      </div>
      <form action={action} className="flex w-full max-w-md flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Icon
              name="mail"
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[18px] text-slate-400"
            />
            <input
              className="w-full rounded-lg border-none bg-navy-2 py-3 pr-4 pl-10 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-sky"
              placeholder="Enter your VIP email address"
              type="email"
              name="email"
              required
            />
          </div>
          <button
            className="shrink-0 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60"
            type="submit"
            disabled={pending}
          >
            Subscribe
          </button>
        </div>
        {state.message ? <p className="text-sm text-sky">{state.message}</p> : null}
        <p className="text-[11px] leading-4 text-slate-400">
          Subscribe only if you want trip notes. Unsubscribe any time. See{" "}
          <Link href="/privacy" className="text-sky hover:underline">
            Privacy & Data Rights
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
