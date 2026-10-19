"use client";

import { useActionState, useMemo, useState } from "react";
import { submitPayment } from "@/app/actions/public";
import { Icon } from "@/components/icon";
import { mediaSrc } from "@/lib/media-path";
import { paymentLines, type PaymentCopy } from "@/lib/payment-copy";

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

export function PaymentForm({ copy }: { copy: PaymentCopy }) {
  const [state, action, pending] = useActionState(submitPayment, { ok: false, message: "" });
  const [submitted, setSubmitted] = useState(false);
  const instructions = paymentLines(copy.instructions);
  const years = useMemo(() => yearOptions(), []);
  const now = new Date();
  const [monthName, setMonthName] = useState<string>(MONTHS[now.getMonth()]);
  const [year, setYear] = useState(String(years[0]));
  const bank = [
    [copy.accountNameLabel, copy.accountName],
    [copy.bankLabel, copy.bankName],
    [copy.accountNoLabel, copy.accountNo],
    [copy.ifscLabel, copy.ifsc],
    [copy.upiLabel, copy.upi],
  ].filter(([, value]) => value);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form
        className="rounded-xl bg-white p-8 shadow-sm"
        action={action}
        onSubmit={() => setSubmitted(true)}
      >
        <input type="hidden" name="month" value={`${monthName} ${year}`} />
        <input
          type="text"
          name="company_fax"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-10000px] h-0 w-0 overflow-hidden opacity-0"
          defaultValue=""
        />
        <h2 className="mb-6 text-xl font-bold">{copy.formTitle}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            {copy.journeyLabel}
            <input
              className="input mt-1"
              required
              name="destination"
              autoComplete="off"
              placeholder="Destination"
            />
          </label>
          <label className="text-sm font-semibold">
            Package tier
            <select className="input mt-1 cursor-pointer" name="tier" defaultValue="Deluxe">
              <option>Standard</option>
              <option>Deluxe</option>
              <option>Super Deluxe</option>
            </select>
          </label>
          <div className="text-sm font-semibold">
            Preferred month
            <div className="mt-1 grid grid-cols-2 gap-2">
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
          <label className="text-sm font-semibold">
            {copy.guestLabel}
            <input className="input mt-1" required name="name" autoComplete="name" />
          </label>
          <label className="text-sm font-semibold">
            {copy.mobileLabel}
            <input className="input mt-1" required type="tel" name="phone" autoComplete="tel" />
          </label>
          <label className="text-sm font-semibold">
            {copy.emailLabel}
            <input className="input mt-1" required type="email" name="email" autoComplete="email" />
          </label>
          <label className="text-sm font-semibold">
            {copy.dateLabel}
            <input className="input mt-1" type="date" name="date" />
          </label>
          <label className="text-sm font-semibold">
            {copy.amountLabel}
            <input
              className="input mt-1"
              required
              name="amount"
              inputMode="decimal"
              placeholder="₹"
              autoComplete="off"
            />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            {copy.referenceLabel}
            <input className="input mt-1" required name="utr" autoComplete="off" />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan py-3 font-semibold text-white disabled:opacity-60"
        >
          <Icon name="verified" /> {copy.submitLabel}
        </button>
        {submitted && state.message ? (
          <p className="mt-4 rounded-lg bg-surface-low p-3 text-sm text-secondary">{state.message}</p>
        ) : null}
        <p className="mt-6 flex items-center gap-2 text-xs text-muted">
          <Icon name="lock" className="text-[16px] text-cyan" /> {copy.privacyNote}
        </p>
      </form>

      <div className="space-y-6">
        <div className="rounded-xl bg-ink p-8 text-white shadow-lg">
          <p className="eyebrow mb-4 text-sky">{copy.transferEyebrow}</p>
          <div className="mx-auto mb-6 flex aspect-square w-full max-w-[360px] items-center justify-center overflow-hidden rounded-xl bg-white p-3">
            {copy.qrImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaSrc(copy.qrImage)} alt="Payment QR code" className="h-full w-full object-contain" />
            ) : (
              <Icon name="qr_code_2" className="!text-[200px] text-ink" />
            )}
          </div>
          <dl className="space-y-2 text-sm">
            {bank.map(([label, value]) => (
              <div key={`${label}-${value}`} className="flex justify-between gap-4">
                <dt className="text-slate-400">{label}</dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">{copy.instructionsTitle}</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
            {instructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
