import {
  saveAdvisor,
  saveBanner,
  savePlacements,
  saveRepeatable,
  saveSection,
} from "@/app/actions/admin";
import { HomepageJump } from "@/components/admin/homepage-jump";
import { PackageRank } from "@/components/admin/package-rank";
import { RepeatRows } from "@/components/admin/repeat-rows";
import { prisma } from "@/lib/db";

export const instant = false;

const jumps = [
  ["banner", "Banner"],
  ["distinction", "Distinction"],
  ["voyage", "Voyage"],
  ["coveted", "Coveted"],
  ["inquiry", "Custom trip"],
  ["departures", "Departures"],
  ["privileges", "Privileges"],
  ["advisor", "Advisor"],
  ["testimonials", "Testimonials"],
  ["faq", "FAQs"],
] as const;

export default async function HomepageAdmin({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; section?: string }>;
}) {
  const query = await searchParams;
  const [settings, sections, features, steps, perks, points, faqs, testimonials, packages, placements] =
    await Promise.all([
      prisma.siteSetting.findUniqueOrThrow({ where: { id: 1 } }),
      prisma.homeSection.findMany(),
      prisma.homeFeature.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.homeStep.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.offerPerk.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.inquiryPoint.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.package.findMany({
        where: { status: "published" },
        select: { id: true, title: true, category: true },
        orderBy: { title: "asc" },
      }),
      prisma.homePlacement.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
  const section = Object.fromEntries(sections.map((item) => [item.slug, item]));
  const ranks = (slot: string) =>
    Object.fromEntries(
      placements.filter((item) => item.slot === slot).map((item) => [item.packageId, item.sortOrder]),
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Homepage</h1>
        <p className="mt-1 text-sm text-muted">Sections follow the public page from top to bottom.</p>
      </div>
      {query.saved ? (
        <p className="rounded-lg bg-white px-4 py-3 text-sm text-secondary shadow-sm" aria-live="polite">
          Saved.
        </p>
      ) : null}
      <HomepageJump items={jumps} initial={query.section} />

      <Section id="banner" title="Banner" hint="First screen: logo, headline, and background image.">
        <form action={saveBanner} className="space-y-3">
          <input type="hidden" name="back" value="/admin/homepage?section=banner" />
          <Field label="Brand name" name="brandName" defaultValue={settings.brandName} />
          <Field label="Short name" name="shortName" defaultValue={settings.shortName} />
          <Field label="Logo URL" name="logoUrl" defaultValue={settings.logoUrl} />
          <Field label="Eyebrow" name="heroEyebrow" defaultValue={settings.heroEyebrow} />
          <Field label="Title" name="heroTitle" defaultValue={settings.heroTitle} />
          <Field label="Subtitle" name="heroSubtitle" defaultValue={settings.heroSubtitle} area />
          <Field label="Background image URL" name="heroImage" defaultValue={settings.heroImage} />
          <Save label="Save banner" />
        </form>
      </Section>

      <Section id="distinction" title="Architects of Seamless Journeys" hint="Heading, then one row per card.">
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="distinction" />
          <input type="hidden" name="back" value="/admin/homepage?section=distinction" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.distinction?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.distinction?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.distinction?.body ?? ""} area />
          <Save label="Save heading" />
        </form>
        <form action={saveRepeatable} className="space-y-3">
          <input type="hidden" name="kind" value="features" />
          <input type="hidden" name="back" value="/admin/homepage?section=distinction" />
          <RepeatRows
            addLabel="Add card"
            fields={[
              { name: "sort", label: "Order" },
              { name: "icon", label: "Icon" },
              { name: "title", label: "Title" },
              { name: "body", label: "Body", area: true },
            ]}
            initial={features.map((item) => ({
              sort: String(item.sortOrder),
              icon: item.icon,
              title: item.title,
              body: item.body,
            }))}
          />
          <Save label="Save cards" />
        </form>
      </Section>

      <Section id="voyage" title="How Your Voyage Unfolds" hint="Heading, then one row per step.">
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="voyage" />
          <input type="hidden" name="back" value="/admin/homepage?section=voyage" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.voyage?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.voyage?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.voyage?.body ?? ""} area />
          <Save label="Save heading" />
        </form>
        <form action={saveRepeatable} className="space-y-3">
          <input type="hidden" name="kind" value="steps" />
          <input type="hidden" name="back" value="/admin/homepage?section=voyage" />
          <RepeatRows
            addLabel="Add step"
            fields={[
              { name: "sort", label: "Order" },
              { name: "stepNo", label: "Step number" },
              { name: "title", label: "Title" },
              { name: "body", label: "Body", area: true },
            ]}
            initial={steps.map((item) => ({
              sort: String(item.sortOrder),
              stepNo: item.stepNo,
              title: item.title,
              body: item.body,
            }))}
          />
          <Save label="Save steps" />
        </form>
      </Section>

      <Section id="coveted" title="Most Coveted Global Escapes" hint="Add a package to show it here. Remove takes it off this section. The first package in the list shows first. Save package order when you are done.">
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="coveted" />
          <input type="hidden" name="back" value="/admin/homepage?section=coveted" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.coveted?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.coveted?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.coveted?.body ?? ""} area />
          <Save label="Save heading" />
        </form>
        <form action={savePlacements} className="space-y-3">
          <input type="hidden" name="slot" value="coveted" />
          <input type="hidden" name="back" value="/admin/homepage?section=coveted" />
          <PackageRank packages={packages} selected={ranks("coveted")} />
          <Save label="Save package order" />
        </form>
      </Section>

      <Section id="inquiry" title="Plan Your Custom Trip" hint="The form on the site saves each submission as a callback request.">
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="inquiry" />
          <input type="hidden" name="back" value="/admin/homepage?section=inquiry" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.inquiry?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.inquiry?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.inquiry?.body ?? ""} area />
          <Save label="Save heading" />
        </form>
        <form action={saveRepeatable} className="space-y-3">
          <input type="hidden" name="kind" value="points" />
          <input type="hidden" name="back" value="/admin/homepage?section=inquiry" />
          <RepeatRows
            addLabel="Add bullet"
            fields={[
              { name: "sort", label: "Order" },
              { name: "label", label: "Bullet" },
            ]}
            initial={points.map((item) => ({ sort: String(item.sortOrder), label: item.label }))}
          />
          <Save label="Save bullets" />
        </form>
      </Section>

      <Section id="departures" title="New Departures Just Added" hint="Add a package to show it here. Remove takes it off this section. Save package order when you are done.">
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="departures" />
          <input type="hidden" name="back" value="/admin/homepage?section=departures" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.departures?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.departures?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.departures?.body ?? ""} area />
          <Save label="Save heading" />
        </form>
        <form action={savePlacements} className="space-y-3">
          <input type="hidden" name="slot" value="latest" />
          <input type="hidden" name="back" value="/admin/homepage?section=departures" />
          <PackageRank packages={packages} selected={ranks("latest")} />
          <Save label="Save package order" />
        </form>
      </Section>

      <Section
        id="privileges"
        title="Honeymoon & Anniversary Privileges"
        hint="Claim Special Package opens only the packages you number here."
      >
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="privileges" />
          <input type="hidden" name="back" value="/admin/homepage?section=privileges" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.privileges?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.privileges?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.privileges?.body ?? ""} area />
          <Field label="Image URL" name="imageUrl" defaultValue={section.privileges?.imageUrl ?? ""} />
          <Field label="Image description" name="imageAlt" defaultValue={section.privileges?.imageAlt ?? ""} />
          <Field label="Image eyebrow" name="captionEyebrow" defaultValue={section.privileges?.captionEyebrow ?? ""} />
          <Field label="Image caption" name="caption" defaultValue={section.privileges?.caption ?? ""} />
          <Field label="Button label" name="ctaLabel" defaultValue={section.privileges?.ctaLabel ?? ""} />
          <Save label="Save privileges" />
        </form>
        <form action={saveRepeatable} className="mb-6 space-y-3">
          <input type="hidden" name="kind" value="perks" />
          <input type="hidden" name="back" value="/admin/homepage?section=privileges" />
          <RepeatRows
            addLabel="Add perk"
            fields={[
              { name: "sort", label: "Order" },
              { name: "label", label: "Perk" },
            ]}
            initial={perks.map((item) => ({ sort: String(item.sortOrder), label: item.label }))}
          />
          <Save label="Save perks" />
        </form>
        <form action={savePlacements} className="space-y-3">
          <input type="hidden" name="slot" value="special" />
          <input type="hidden" name="back" value="/admin/homepage?section=privileges" />
          <PackageRank packages={packages} selected={ranks("special")} />
          <Save label="Save special packages" />
        </form>
      </Section>

      <Section id="advisor" title="Travel advisor" hint="WhatsApp link, phone, and the text beside the photo.">
        <form action={saveAdvisor} className="space-y-3">
          <input type="hidden" name="back" value="/admin/homepage?section=advisor" />
          <Field label="Eyebrow" name="advisorEyebrow" defaultValue={settings.advisorEyebrow} />
          <Field label="Title" name="advisorTitle" defaultValue={settings.advisorTitle} />
          <Field label="Body" name="advisorBody" defaultValue={settings.advisorBody} area />
          <Field label="Photo URL" name="advisorImage" defaultValue={settings.advisorImage} />
          <Field label="WhatsApp link" name="whatsapp" defaultValue={settings.whatsapp} />
          <Field label="Phone" name="phone" defaultValue={settings.phone} />
          <Field label="Button phone" name="phoneAlt" defaultValue={settings.phoneAlt} />
          <Field label="Dial number" name="phoneTel" defaultValue={settings.phoneTel} />
          <Field label="Email" name="email" defaultValue={settings.email} />
          <Save label="Save advisor" />
        </form>
      </Section>

      <Section id="testimonials" title="Testimonials" hint="One row per guest. Order 1 shows first.">
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="testimonials" />
          <input type="hidden" name="back" value="/admin/homepage?section=testimonials" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.testimonials?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.testimonials?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.testimonials?.body ?? ""} area />
          <Save label="Save heading" />
        </form>
        <form action={saveRepeatable} className="space-y-3">
          <input type="hidden" name="kind" value="testimonials" />
          <input type="hidden" name="back" value="/admin/homepage?section=testimonials" />
          <RepeatRows
            addLabel="Add testimonial"
            fields={[
              { name: "sort", label: "Order" },
              { name: "name", label: "Name" },
              { name: "tripLabel", label: "Trip" },
              { name: "quote", label: "Quote", area: true },
              { name: "imageUrl", label: "Photo URL" },
            ]}
            initial={testimonials.map((item) => ({
              sort: String(item.sortOrder),
              name: item.name,
              tripLabel: item.tripLabel,
              quote: item.quote,
              imageUrl: item.imageUrl ?? "",
            }))}
          />
          <Save label="Save testimonials" />
        </form>
      </Section>

      <Section id="faq" title="FAQs" hint="Heading, then one row per question.">
        <form action={saveSection} className="mb-6 space-y-3">
          <input type="hidden" name="slug" value="faq" />
          <input type="hidden" name="back" value="/admin/homepage?section=faq" />
          <Field label="Eyebrow" name="eyebrow" defaultValue={section.faq?.eyebrow ?? ""} />
          <Field label="Title" name="title" defaultValue={section.faq?.title ?? ""} />
          <Field label="Body" name="body" defaultValue={section.faq?.body ?? ""} area />
          <Save label="Save heading" />
        </form>
        <form action={saveRepeatable} className="space-y-3">
          <input type="hidden" name="kind" value="faqs" />
          <input type="hidden" name="back" value="/admin/homepage?section=faq" />
          <RepeatRows
            addLabel="Add FAQ"
            fields={[
              { name: "sort", label: "Order" },
              { name: "question", label: "Question" },
              { name: "answer", label: "Answer", area: true },
            ]}
            initial={faqs.map((item) => ({
              sort: String(item.sortOrder),
              question: item.question,
              answer: item.answer,
            }))}
          />
          <Save label="Save FAQs" />
        </form>
      </Section>
    </div>
  );
}

function Section({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-40 rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-balance">{title}</h2>
      <p className="mt-1 mb-4 text-sm text-muted">{hint}</p>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  defaultValue,
  area,
}: {
  label: string;
  name: string;
  defaultValue: string;
  area?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {area ? (
        <textarea className="input mt-1 min-h-24 py-2" name={name} defaultValue={defaultValue} autoComplete="off" />
      ) : (
        <input className="input mt-1" name={name} defaultValue={defaultValue} autoComplete="off" />
      )}
    </label>
  );
}

function Save({ label }: { label: string }) {
  return (
    <button className="rounded-lg bg-cyan px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-cyan">
      {label}
    </button>
  );
}
