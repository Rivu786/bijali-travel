"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";

export function PaymentForm({
  title,
  duration,
  priceLabel,
}: {
  title: string;
  duration: string;
  priceLabel: string;
}) {
  const [done, setDone] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <form
        className="rounded-xl bg-white p-8 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <h2 className="mb-6 text-xl font-bold">Student Booking & Transaction Details</h2>
        <div className="mb-6 rounded-xl bg-surface-low p-4">
          <p className="text-sm text-muted">Selected journey</p>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted">
            {duration}
            {priceLabel ? ` • ${priceLabel} / person` : ""}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Guest name
            <input className="input mt-1" required name="name" />
          </label>
          <label className="text-sm font-semibold">
            Mobile
            <input className="input mt-1" required type="tel" name="phone" />
          </label>
          <label className="text-sm font-semibold">
            Email
            <input className="input mt-1" required type="email" name="email" />
          </label>
          <label className="text-sm font-semibold">
            Travel date
            <input className="input mt-1" type="date" name="date" />
          </label>
          <label className="text-sm font-semibold">
            Amount transferred
            <input className="input mt-1" required placeholder={formatPrice(tour.price)} />
          </label>
          <label className="text-sm font-semibold">
            UTR / UPI reference
            <input className="input mt-1" required name="utr" />
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Upload payment screenshot
          <input className="mt-2 block w-full text-sm" type="file" accept="image/*" />
        </label>
        <button
          type="submit"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan py-3 font-semibold text-white"
        >
          <Icon name="verified" /> Submit booking proof
        </button>
        {done ? (
          <p className="mt-4 rounded-lg bg-surface-low p-3 text-sm text-secondary">
            Proof received. Accounts will confirm your allotment by email and WhatsApp.
          </p>
        ) : null}
        <p className="mt-6 flex items-center gap-2 text-xs text-muted">
          <Icon name="lock" className="text-[16px] text-cyan" /> 100% Private and
          Protection Guaranteed
        </p>
      </form>

      <div className="space-y-6">
        <div className="rounded-xl bg-ink p-8 text-white shadow-lg">
          <p className="eyebrow mb-4 text-sky">Direct bank transfer & instant UPI</p>
          <div className="mb-6 flex h-44 items-center justify-center rounded-xl bg-white/5">
            <Icon name="qr_code_2" className="text-[120px] text-sky" />
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Account name</dt>
              <dd>Bijali Tours & Travels</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Bank</dt>
              <dd>HDFC Bank</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">Account no.</dt>
              <dd>50200000001234</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">IFSC</dt>
              <dd>HDFC0001234</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-400">UPI</dt>
              <dd>bijalitours@hdfcbank</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold">Fulfillment instructions</h3>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Transfer the package amount via UPI or NEFT using the details shown.</li>
            <li>Enter the UTR and upload a screenshot of the successful transfer.</li>
            <li>Our accounts desk confirms within business hours and issues your voucher.</li>
            <li>Keep the reference handy for airport / hotel assistance.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
