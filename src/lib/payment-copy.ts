export const paymentDefaults = {
  eyebrow: "Secure checkout",
  title: "Bijali Tours & Travels Secure Payment Portal",
  steps: "Select booking\nTransfer details\nUpload proof\nConfirmed",
  formTitle: "Student Booking & Transaction Details",
  journeyLabel: "Selected journey",
  guestLabel: "Guest name",
  mobileLabel: "Mobile",
  emailLabel: "Email",
  dateLabel: "Travel date",
  amountLabel: "Amount transferred",
  referenceLabel: "UTR / UPI reference",
  uploadLabel: "Upload payment screenshot",
  submitLabel: "Submit booking proof",
  successMessage: "Proof received. Accounts will confirm your allotment by email and WhatsApp.",
  privacyNote: "100% Private and Protection Guaranteed",
  transferEyebrow: "Direct bank transfer & instant UPI",
  qrImage: "",
  accountNameLabel: "Account name",
  accountName: "Bijali Tours & Travels",
  bankLabel: "Bank",
  bankName: "HDFC Bank",
  accountNoLabel: "Account no.",
  accountNo: "50200000001234",
  ifscLabel: "IFSC",
  ifsc: "HDFC0001234",
  upiLabel: "UPI",
  upi: "bijalitours@hdfcbank",
  instructionsTitle: "Fulfillment instructions",
  instructions:
    "Transfer the package amount via UPI or NEFT using the details shown.\nEnter the UTR and upload a screenshot of the successful transfer.\nOur accounts desk confirms within business hours and issues your voucher.\nKeep the reference handy for airport / hotel assistance.",
};

export type PaymentCopy = typeof paymentDefaults;

const limits: Partial<Record<keyof PaymentCopy, number>> = {
  eyebrow: 160,
  title: 255,
  formTitle: 255,
  journeyLabel: 160,
  guestLabel: 80,
  mobileLabel: 80,
  emailLabel: 80,
  dateLabel: 80,
  amountLabel: 80,
  referenceLabel: 80,
  uploadLabel: 160,
  submitLabel: 160,
  privacyNote: 255,
  transferEyebrow: 160,
  accountNameLabel: 80,
  accountName: 180,
  bankLabel: 80,
  bankName: 180,
  accountNoLabel: 80,
  accountNo: 80,
  ifscLabel: 80,
  ifsc: 40,
  upiLabel: 80,
  upi: 180,
  instructionsTitle: 180,
};

export function clipPayment(input: PaymentCopy): PaymentCopy {
  const next = { ...input };
  for (const key of Object.keys(limits) as (keyof PaymentCopy)[]) {
    const max = limits[key];
    if (max) next[key] = next[key].slice(0, max);
  }
  return next;
}

export function paymentLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
