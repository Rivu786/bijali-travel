"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { mediaSrc } from "@/lib/media-path";
import { paymentLines, type PaymentCopy } from "@/lib/payment-copy";

export function PaymentForm({
  title,
  duration,
  priceLabel,
  copy,
}: {
  title: string;
  duration: string;
  priceLabel: string;
  copy: PaymentCopy;
}) {
  const [done, setDone] = useState(false);
  const steps = paymentLines(copy.steps);
  const instructions = paymentLines(copy.instructions);
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
        onSubmit={(event) => {
          event.preventDefault();
          setDone(true);
        }}
      >
        <h2 className="mb-6 text-xl font-bold">{copy.formTitle}</h2>
        <div className="mb-6 rounded-xl bg-surface-low p-4">
          <p className="text-sm text-muted">{copy.journeyLabel}</p>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted">
            {duration}
            {priceLabel ? ` • ${priceLabel} / person` : ""}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <input className="input mt-1" required placeholder={priceLabel || "Amount"} />
          </label>
          <label className="text-sm font-semibold">
            {copy.referenceLabel}
            <input className="input mt-1" required name="utr" autoComplete="off" />
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold">
          {copy.uploadLabel}
          <input className="mt-2 block w-full text-sm" type="file" accept="image/*" />
        </label>
        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan py-3 font-semibold text-white"
        >
          <Icon name="verified" /> {copy.submitLabel}
        </button>
        {done ? (
          <p className="mt-4 rounded-lg bg-surface-low p-3 text-sm text-secondary">{copy.successMessage}</p>
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
