import { InquiryForm } from "@/components/inquiry-form";
import { site } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:px-8">
      <div>
        <span className="eyebrow text-secondary">Concierge desk</span>
        <h1 className="display mt-3 mb-6">Contact Bijali</h1>
        <p className="mb-6 text-muted">
          Share your dates and we will return a tailored proposal. For urgent
          amendments on an existing booking, call the 24/7 helpline.
        </p>
        <ul className="space-y-3 text-sm">
          <li>
            <strong>Helpline:</strong> {site.phone}
          </li>
          <li>
            <strong>Email:</strong> {site.email}
          </li>
          <li>
            <strong>Hours:</strong> 24/7 operations desk
          </li>
        </ul>
      </div>
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <InquiryForm />
      </div>
    </div>
  );
}
