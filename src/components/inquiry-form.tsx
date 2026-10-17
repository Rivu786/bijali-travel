"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/app/actions/public";
import { Icon } from "@/components/icon";

export function InquiryForm() {
  const [state, action, pending] = useActionState(submitInquiry, { ok: false, message: "" });

  return (
    <form className="space-y-5" action={action}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="eyebrow mb-1.5 block text-muted">Full Name</label>
          <input className="input" required placeholder="Your full name" name="name" />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block text-muted">
            Phone Number (with country code)
          </label>
          <input className="input" required type="tel" placeholder="+91" name="phone" />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block text-muted">Email Address</label>
          <input className="input" required type="email" name="email" />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block text-muted">Desired Destination</label>
          <input
            className="input"
            required
            placeholder="e.g. Kashmir or Amalfi Coast"
            name="destination"
          />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block text-muted">Preferred Month</label>
          <select className="input cursor-pointer" name="month" defaultValue="October 2026">
            <option>October 2026</option>
            <option>November 2026</option>
            <option>December 2026 / Holiday</option>
            <option>Early 2027</option>
          </select>
        </div>
        <div>
          <label className="eyebrow mb-1.5 block text-muted">Preferred Package Tier</label>
          <div className="grid h-12 grid-cols-3 items-center gap-2">
            {["Standard", "Deluxe", "Super Deluxe"].map((tier, i) => (
              <label
                key={tier}
                className="flex h-full cursor-pointer items-center justify-center rounded-lg bg-surface-container text-center text-[11px] font-bold tracking-wider uppercase has-[:checked]:bg-cyan has-[:checked]:text-white"
              >
                <input
                  className="hidden"
                  name="tier"
                  type="radio"
                  value={tier}
                  defaultChecked={i === 1}
                />
                {tier === "Super Deluxe" ? "Super Luxe" : tier}
              </label>
            ))}
          </div>
        </div>
      </div>
      <button
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan py-4 text-sm font-semibold text-white shadow-md hover:bg-cyan/90 disabled:opacity-60"
        type="submit"
        disabled={pending}
      >
        <Icon name="phone_in_talk" className="text-[18px]" /> Request Free Call Back
      </button>
      <p className="eyebrow text-center text-outline">
        No spam. 100% confidential planning. Direct WhatsApp response available.
      </p>
      {state.message ? (
        <p className="rounded-lg bg-surface-low p-3 text-center text-sm text-secondary">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
