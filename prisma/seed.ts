import { PrismaClient, type Category, type Tier } from "@prisma/client";
import { loadProjectEnv } from "../src/lib/load-env";
import { faqs, heroImage, maldivesImage, packages, testimonials } from "../src/lib/packages";
import { site } from "../src/lib/site";

loadProjectEnv();

const prisma = new PrismaClient();

const stateBySlug: Record<string, string> = {
  "gangtok-pelling-darjeeling": "Sikkim",
  darjeeling: "West Bengal",
  "gangtok-pelling-ravangla": "Sikkim",
  "north-sikkim": "Sikkim",
  "silk-route": "Sikkim",
  "shillong-cherrapunjee": "Meghalaya",
  kaziranga: "Assam",
  arunachal: "Arunachal Pradesh",
  dooars: "West Bengal",
  "dooars-4n5d": "West Bengal",
  kashmir: "Jammu and Kashmir",
  "kashmir-premium": "Jammu and Kashmir",
  "leh-ladakh": "Ladakh",
  nainital: "Uttarakhand",
  "shimla-manali": "Himachal Pradesh",
  "andaman-havelock": "Andaman and Nicobar",
  andaman: "Andaman and Nicobar",
  goa: "Goa",
  "kerala-backwaters": "Kerala",
  "rajasthan-palaces": "Rajasthan",
  "bali-tropical-bliss": "Bali",
  "swiss-alpine": "Switzerland",
  "amalfi-yachting": "Italy",
  "kyoto-tokyo": "Japan",
  "kenya-mara": "Kenya",
  "digha-mandarmani": "West Bengal",
  "sundarban-weekend": "West Bengal",
  "puri-konark": "Odisha",
};

const groupByRegion: Record<string, string> = {
  "North East": "north-east",
  Dooars: "dooars",
  Kashmir: "kashmir",
  Uttarakhand: "hills",
  Himachal: "hills",
  Andaman: "coast",
  Goa: "coast",
  Domestic: "south",
};

const popularSlugs = new Set([
  "swiss-alpine",
  "bali-tropical-bliss",
  "amalfi-yachting",
  "kenya-mara",
  "rajasthan-palaces",
]);

function categoryFor(region: string): Category {
  if (region === "International") return "international";
  if (region === "Weekend") return "weekend";
  return "domestic";
}

function tierFor(tier: string): Tier {
  if (tier === "Super Deluxe") return "SuperDeluxe";
  if (tier === "Standard") return "Standard";
  return "Deluxe";
}

const weekendPackages = [
  {
    slug: "digha-mandarmani",
    title: "Digha & Mandarmani Weekend",
    region: "Weekend",
    location: "Digha",
    image: maldivesImage,
    summary: "A short coastal weekend with a private sea-facing stay and an easy drive from Kolkata.",
  },
  {
    slug: "sundarban-weekend",
    title: "Sundarban Weekend",
    region: "Weekend",
    location: "Sundarbans",
    image: heroImage,
    summary: "A two-night delta escape with a private boat, mangrove walks, and a riverside lodge.",
  },
  {
    slug: "puri-konark",
    title: "Puri Konark Weekend",
    region: "Weekend",
    location: "Puri",
    image: maldivesImage,
    summary: "Temple mornings, a Konark circuit, and a beach hotel paced for a long weekend.",
  },
].map((item) => ({
  ...item,
  duration: "3 Days / 2 Nights",
  nights: 2,
  days: 3,
  tier: "Deluxe" as const,
  price: 249,
  originalPrice: 320,
  currency: "INR",
  rating: 4.7,
  reviews: 28,
  gallery: [item.image, heroImage],
  itinerary: [
    { day: "Day 1", title: "Arrival", body: "Private transfer and hotel check-in." },
    { day: "Day 2", title: "The coast", body: "Signature sightseeing with a flexible afternoon." },
    { day: "Day 3", title: "Departure", body: "Late breakfast and return transfer." },
  ],
  inclusions: ["2 nights hotel", "Private transfers", "Breakfast"],
  exclusions: ["Flights", "Personal expenses"],
  stays: [{ name: "Weekend sea lodge", place: item.location, image: item.image }],
}));

async function main() {
  await prisma.packageTag.deleteMany();
  await prisma.packageGallery.deleteMany();
  await prisma.packageItinerary.deleteMany();
  await prisma.packageItem.deleteMany();
  await prisma.packageStay.deleteMany();
  await prisma.package.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.menuGroup.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.homeFeature.deleteMany();
  await prisma.homeStep.deleteMany();
  await prisma.offerPerk.deleteMany();
  await prisma.inquiryPoint.deleteMany();
  await prisma.footerBadge.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.homeSection.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.tripInquiry.deleteMany();

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      brandName: site.name,
      shortName: site.shortName,
      email: site.email,
      phone: site.phone,
      phoneAlt: site.phoneAlt,
      phoneTel: site.phoneTel,
      whatsapp: site.whatsapp,
      logoUrl: site.logo,
      heroEyebrow: "Bijali Tours & Travels • Curated Expeditions",
      heroTitle: "Explore the World in Comfort & Style",
      heroSubtitle:
        "Curated National & International Tour Packages Customized for You. Handcrafted private itineraries, unlisted sanctuaries, and five-star ease.",
      heroImage,
      advisorEyebrow: "Personalized Concierge Matching",
      advisorTitle: "Confused where to go? Talk to a Bijali Travel Advisor now.",
      advisorBody:
        "Our destination directors are on standby to build your bespoke vacation proposal based on your dates and party size.",
      advisorImage: site.advisor,
      footerBlurb:
        "Curators of ultra-luxury bespoke global journeys, private expeditions, and sanctuary stays tailored for the discerning voyager.",
      subscribeEyebrow: "Exclusive Membership",
      subscribeTitle: "Join LuxePrivé for secret departure deals",
      subscribeBody:
        "Receive handcrafted bespoke itineraries, private jet charter allotments, and unlisted seasonal villas directly to your inbox.",
    },
  });

  const groups = await Promise.all(
    [
      ["north-east", "North East India", "landscape", "domestic", 1],
      ["dooars", "Dooars", "nature_people", "domestic", 2],
      ["kashmir", "Jammu & Kashmir", "ac_unit", "domestic", 3],
      ["hills", "Uttarakhand & Himachal", "temple_hindu", "domestic", 4],
      ["coast", "Andaman & Goa", "scuba_diving", "domestic", 5],
      ["south", "South India & Rajasthan", "sailing", "domestic", 6],
    ].map(([slug, title, icon, category, sortOrder]) =>
      prisma.menuGroup.create({
        data: {
          slug: String(slug),
          title: String(title),
          icon: String(icon),
          category: category as Category,
          sortOrder: Number(sortOrder),
        },
      }),
    ),
  );
  const groupId = Object.fromEntries(groups.map((group) => [group.slug, group.id]));

  const tags = await Promise.all(
    [
      ["recent", "Recent"],
      ["popular", "Popular"],
      ["high-demand", "High demand"],
    ].map(([slug, name]) => prisma.tag.create({ data: { slug, name } })),
  );
  const tagId = Object.fromEntries(tags.map((tag) => [tag.slug, tag.id]));

  const catalog = [...packages, ...weekendPackages];
  for (const [index, tour] of catalog.entries()) {
    const category = categoryFor(tour.region);
    const tagSlugs = new Set<string>();
    if ("latest" in tour && tour.latest) tagSlugs.add("recent");
    if (("featured" in tour && tour.featured) || popularSlugs.has(tour.slug)) tagSlugs.add("popular");
    if (category === "international" && tour.rating >= 4.9) tagSlugs.add("high-demand");
    if (tour.slug === "digha-mandarmani") tagSlugs.add("recent");

    await prisma.package.create({
      data: {
        slug: tour.slug,
        title: tour.title,
        category,
        groupId: groupByRegion[tour.region] ? groupId[groupByRegion[tour.region]] : null,
        state: stateBySlug[tour.slug] ?? null,
        location: tour.location,
        tier: tierFor(tour.tier),
        duration: tour.duration,
        nights: tour.nights,
        days: tour.days,
        price: tour.price,
        originalPrice: tour.originalPrice ?? null,
        currency: tour.currency,
        rating: tour.rating,
        reviewCount: tour.reviews,
        summary: tour.summary,
        imageUrl: tour.image,
        latestBadge: "latestBadge" in tour ? tour.latestBadge ?? null : null,
        status: "published",
        createdAt: new Date(Date.now() - (catalog.length - index) * 86_400_000),
        gallery: { create: tour.gallery.map((imageUrl, sortOrder) => ({ imageUrl, sortOrder })) },
        itinerary: {
          create: tour.itinerary.map((day, sortOrder) => ({
            dayLabel: day.day,
            title: day.title,
            body: day.body,
            sortOrder,
          })),
        },
        items: {
          create: [
            ...tour.inclusions.map((label, sortOrder) => ({
              kind: "inclusion" as const,
              label,
              sortOrder,
            })),
            ...tour.exclusions.map((label, sortOrder) => ({
              kind: "exclusion" as const,
              label,
              sortOrder,
            })),
          ],
        },
        stays: {
          create: tour.stays.map((stay, sortOrder) => ({
            name: stay.name,
            place: stay.place,
            imageUrl: stay.image,
            sortOrder,
          })),
        },
        tags: {
          create: [...tagSlugs].map((slug) => ({ tagId: tagId[slug] })),
        },
      },
    });
  }

  await prisma.homeSection.createMany({
    data: [
      {
        slug: "distinction",
        eyebrow: "The Bijali Distinction",
        title: "Architects of Seamless Journeys",
        body: "We dismantle the frictions of traditional touring to deliver effortless elegance at direct partner value.",
      },
      {
        slug: "voyage",
        eyebrow: "Effortless Process",
        title: "How Your Voyage Unfolds",
        body: "From your first whim to private arrival transfers, experience white-glove coordination in four transparent steps.",
      },
      {
        slug: "coveted",
        eyebrow: "Signature Journeys",
        title: "Most Coveted Global Escapes",
      },
      {
        slug: "departures",
        eyebrow: "Fresh Allotments",
        title: "New Departures Just Added",
      },
      {
        slug: "privileges",
        eyebrow: "Save up to 30% Off",
        title: "Honeymoon & Anniversary Privileges",
        body: "Reserve any Deluxe or Super Deluxe journey and unlock our complimentary signature romance package.",
        imageUrl: maldivesImage,
        imageAlt: "Overwater lagoon pavilion",
        captionEyebrow: "Featured Honeymoon Sanctuary",
        caption: "Overwater Lagoon Pavilion • Baa Atoll, Maldives",
        ctaLabel: "Claim Special Package",
        ctaHref: "/packages?tag=high-demand",
      },
      {
        slug: "inquiry",
        eyebrow: "Tailor-Made Quote in 24h",
        title: "Plan Your Custom Trip with Bijali Tours & Travels",
        body: "Tell us your dream holiday, and our itinerary planners will design your bespoke quotation within 24 hours.",
      },
      {
        slug: "testimonials",
        eyebrow: "Traveler Impressions",
        title: "Words from Discerning Voyagers",
        body: "Over 2,400 curated holidaymakers across 38 countries rate Bijali at 4.95 out of 5 stars.",
      },
      {
        slug: "faq",
        eyebrow: "Clarity & Assurance",
        title: "Frequently Asked Questions",
        body: "Everything you need to know about booking, tier flexibility, and guarantees.",
      },
    ],
  });

  await prisma.homeFeature.createMany({
    data: [
      ["support_agent", "24/7 Travel Assistance", "Dedicated round-the-clock concierge managing unexpected itinerary pivots instantly."],
      ["price_check", "Best Price Guarantee", "Premium suites and private charters locked in via direct hotelier and aviation contracts."],
      ["badge", "Certified Guides", "Multilingual local historians, wildlife naturalists, and private chauffeurs vetted for discreet excellence."],
      ["tune", "100% Customized", "Zero cookie-cutter group constraints. Every dawn, meal, and transfer is mapped around you."],
    ].map(([icon, title, body], sortOrder) => ({ icon, title, body, sortOrder })),
  });

  await prisma.homeStep.createMany({
    data: [
      ["01", "Choose Destination", "Select from our vetted sanctuaries or name your dream retreat."],
      ["02", "Customize Package", "Refine pacing, villa tiers, culinary preferences, and add-ons."],
      ["03", "Confirm & Pay", "Lock reservations with flexible installments and encrypted checkout."],
      ["04", "Bon Voyage!", "Step into chauffeured transport with 24/7 remote care."],
    ].map(([stepNo, title, body], sortOrder) => ({ stepNo, title, body, sortOrder })),
  });

  await prisma.offerPerk.createMany({
    data: [
      "Free Candlelight Beach Dinner",
      "90-Min Couple Aromatherapy Spa",
      "Welcome Bottle",
      "Guaranteed Oceanview Upgrade",
    ].map((label, sortOrder) => ({ label, sortOrder })),
  });

  await prisma.inquiryPoint.createMany({
    data: [
      "Complimentary itinerary consultation with zero obligation",
      "No spam. 100% confidential planning & data privacy",
      "Direct IATA accredited flight integration available",
    ].map((label, sortOrder) => ({ label, sortOrder })),
  });

  await prisma.footerBadge.createMany({
    data: [
      ["IATA Accredited", "verified_user"],
      ["Ministry of Tourism Approved", "shield"],
      ["ASTA Member", "stars"],
      ["100% Financial Protection", "lock"],
    ].map(([label, icon], sortOrder) => ({ label, icon, sortOrder })),
  });

  await prisma.partner.createMany({
    data: [
      ["IATA", "Accredited Agent", "iata"],
      ["SSL Secure", "256-bit Checkout", "ssl"],
      ["MoT India", "Recognised Partner", "mot"],
      ["TOAB", "Tour Operators", "toab"],
      ["ADTOI", "Inbound Tourism", "adtoi"],
      ["Incredible India", "Ministry of Tourism", "incredible"],
    ].map(([name, caption, markKey], sortOrder) => ({ name, caption, markKey, sortOrder })),
  });

  await prisma.faq.createMany({
    data: faqs.map((item, sortOrder) => ({
      question: item.q,
      answer: item.a,
      sortOrder,
    })),
  });

  await prisma.testimonial.createMany({
    data: testimonials.map((item, sortOrder) => ({
      name: item.name,
      tripLabel: item.trip,
      quote: item.quote,
      imageUrl: item.image,
      sortOrder,
    })),
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
