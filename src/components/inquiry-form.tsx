"use client";

import { useActionState, useMemo, useState } from "react";
import { submitInquiry } from "@/app/actions/public";
import { Icon } from "@/components/icon";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function yearOptions() {
  const start = new Date().getFullYear();
  return Array.from({ length: 12 }, (_, i) => start + i);
}

export function InquiryForm({ page = "/" }: { page?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, { ok: false, message: "" });
  const years = useMemo(() => yearOptions(), []);
  const now = new Date();
  const [monthName, setMonthName] = useState<string>(MONTHS[now.getMonth()]);
  const [year, setYear] = useState(String(years[0]));

  return (
    <form className="space-y-5" action={action}>
      <input type="hidden" name="page" value={page} />
      <input type="hidden" name="month" value={`${monthName} ${year}`} />
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-10000px] h-0 w-0 overflow-hidden opacity-0"
        defaultValue=""
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="eyebrow mb-1.5 block text-muted">Trip Type</label>
          <div className="grid h-12 grid-cols-2 items-center gap-2">
            {["Domestic", "International"].map((type, i) => (
              <label
                key={type}
                className="flex h-full cursor-pointer items-center justify-center rounded-lg bg-surface-container text-center text-[11px] font-bold tracking-wider uppercase has-[:checked]:bg-cyan has-[:checked]:text-white"
              >
                <input
                  className="hidden"
                  name="tripType"
                  type="radio"
                  value={type}
                  defaultChecked={i === 0}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
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
          <label className="eyebrow mb-1.5 block text-muted">Country</label>
          <input className="input" placeholder="e.g. India" name="country" />
        </div>
        <div>
          <label className="eyebrow mb-1.5 block text-muted">State / Province</label>
          <input className="input" placeholder="e.g. West Bengal" name="state" />
        </div>
        <div className="sm:col-span-2">
          <label className="eyebrow mb-1.5 block text-muted">Preferred Month</label>
          <div className="grid grid-cols-2 gap-3">
            <select
              className="input cursor-pointer"
              value={monthName}
              onChange={(e) => setMonthName(e.target.value)}
              aria-label="Preferred month"
            >
              {MONTHS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className="input cursor-pointer"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              aria-label="Preferred year"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sm:col-span-2">
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
