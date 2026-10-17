"use client";

import { useState } from "react";
import { savePayment } from "@/app/actions/admin";
import type { PaymentCopy } from "@/lib/payment-copy";

export function PaymentEditor({ content, images }: { content: PaymentCopy; images: string[] }) {
  const [qrImage, setQrImage] = useState(content.qrImage);

  return (
    <form action={savePayment} className="space-y-8">
      <section className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Page heading</h2>
        <Field label="Eyebrow" name="eyebrow" defaultValue={content.eyebrow} />
        <Field label="Title" name="title" defaultValue={content.title} />
        <Area label="Steps" name="steps" defaultValue={content.steps} hint="One step per line." />
      </section>

      <section className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Booking form</h2>
        <Field label="Form title" name="formTitle" defaultValue={content.formTitle} />
        <Field label="Selected journey label" name="journeyLabel" defaultValue={content.journeyLabel} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Guest name label" name="guestLabel" defaultValue={content.guestLabel} />
          <Field label="Mobile label" name="mobileLabel" defaultValue={content.mobileLabel} />
          <Field label="Email label" name="emailLabel" defaultValue={content.emailLabel} />
          <Field label="Travel date label" name="dateLabel" defaultValue={content.dateLabel} />
          <Field label="Amount label" name="amountLabel" defaultValue={content.amountLabel} />
          <Field label="Reference label" name="referenceLabel" defaultValue={content.referenceLabel} />
        </div>
        <Field label="Upload label" name="uploadLabel" defaultValue={content.uploadLabel} />
        <Field label="Submit button" name="submitLabel" defaultValue={content.submitLabel} />
        <Area label="Success message" name="successMessage" defaultValue={content.successMessage} />
        <Field label="Privacy note" name="privacyNote" defaultValue={content.privacyNote} />
      </section>

      <section className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Bank transfer and QR</h2>
        <Field label="Card eyebrow" name="transferEyebrow" defaultValue={content.transferEyebrow} />
        <label className="block text-sm font-semibold">
          QR code image
          <input
            className="input mt-1"
            name="qrImage"
            value={qrImage}
            onChange={(event) => setQrImage(event.target.value)}
            autoComplete="off"
            placeholder="/media/qr.png or a full image address"
          />
        </label>
        {qrImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrImage} alt="" className="h-64 w-64 rounded-lg bg-white object-contain" />
        ) : (
          <p className="text-sm text-muted">No QR image yet. The payment page shows a placeholder until you add one.</p>
        )}
        {images.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-semibold">Choose from Media</p>
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
              {images.map((src) => (
                <button
                  key={src}
                  type="button"
                  className={`shrink-0 rounded-lg ring-2 ring-offset-2 ${qrImage === src ? "ring-cyan" : "ring-transparent"}`}
                  onClick={() => setQrImage(src)}
                  aria-label={`Use ${src} as the QR image`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-20 w-20 rounded-lg bg-white object-contain" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted">Upload the QR image in Media, then choose it here.</p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Account name label" name="accountNameLabel" defaultValue={content.accountNameLabel} />
          <Field label="Account name" name="accountName" defaultValue={content.accountName} />
          <Field label="Bank label" name="bankLabel" defaultValue={content.bankLabel} />
          <Field label="Bank" name="bankName" defaultValue={content.bankName} />
          <Field label="Account number label" name="accountNoLabel" defaultValue={content.accountNoLabel} />
          <Field label="Account number" name="accountNo" defaultValue={content.accountNo} />
          <Field label="IFSC label" name="ifscLabel" defaultValue={content.ifscLabel} />
          <Field label="IFSC" name="ifsc" defaultValue={content.ifsc} />
          <Field label="UPI label" name="upiLabel" defaultValue={content.upiLabel} />
          <Field label="UPI" name="upi" defaultValue={content.upi} />
        </div>
      </section>

      <section className="space-y-3 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <Field label="Heading" name="instructionsTitle" defaultValue={content.instructionsTitle} />
        <Area label="Steps" name="instructions" defaultValue={content.instructions} hint="One instruction per line." />
      </section>

      <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
        Save payment page
      </button>
    </form>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input className="input mt-1" name={name} defaultValue={defaultValue} autoComplete="off" />
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <textarea className="input mt-1 min-h-28 py-2" name={name} defaultValue={defaultValue} autoComplete="off" />
      {hint ? <span className="mt-1 block text-xs font-normal text-muted">{hint}</span> : null}
    </label>
  );
}
