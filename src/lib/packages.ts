export type PackageTier = "Standard" | "Deluxe" | "Super Deluxe";

export type TourPackage = {
  slug: string;
  title: string;
  region: string;
  duration: string;
  nights: number;
  days: number;
  location: string;
  tier: PackageTier;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviews: number;
  summary: string;
  image: string;
  gallery: string[];
  featured?: boolean;
  latest?: boolean;
  latestBadge?: string;
  itinerary: { day: string; title: string; body: string }[];
  inclusions: string[];
  exclusions: string[];
  stays: { name: string; place: string; image: string }[];
};

const img = {
  bali: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUqFx_qxilRKR3k2icRxX-UGGZ6D0Y7aAYYczOFVNcPM1_YfOueFI-zaoorjOqo8cFcv5bnHY9fba4xnOThuW7sR5qwzE5SFnpwNv1hgwC9uLukLED7FDjyJNNtFTpcIBghiusZ6AQnoQgzispTdoOygJtAeBiaFP670ih-Ymai4rN4L79oaphoOD5HNOrWbchP_kXXBVJ0pUXFUAJnMxweG4JtIkwLAP2Z_kIF_cjbAb81YH0V4P_Q",
  swiss:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuANUeSWWByZjowr-QqRZDOmj1qpBMtfJQljarJ-z8C7_LCW_p9uKAkQDRWn7gmq7rh6sP0KgC0WGxCikSm9NSg1E-dR_psevh-ttYxUXCcGa2__KkeFh51lBMOfYbKHqEWYHTT8BpEe0zy29drnIyalnc7LkYwvJ9w0778KTBT0uDFhO1Kh0Qh1sjzU6V19Nz0nTp2Cm5e32EYFu_vVZzdkrJ7OK0CLdwxaRavVSjmGHbZyqsGFnbhG4w",
  kerala:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAZVTN8lgGkiAEJoENKFi6mzetkMjFwFD26CPqs7OBUrY7zxexZ4uKoFrGvDHk0c4Lcn2JxHL9EyABVt15K3XNVE_gMpRoQRe2csZKf_2tzH5x0cdrLxNp1trE3V7y-iYBytSCGKBWWkNbc8DcdttTdEecwUUM1BDd7LPHoLqRPByG7xZHSA8NGZS51UdcEBf4rsKHGAqxGN8mLKE9iUazf7UIUrowr5G_20w4vQhv6KUwnlrvHd77qCg",
  rajasthan:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD68il6KtwQZceCUDaLqLLkxcfwIHyMVuXaoc0YVqPeGnkfIGrk5J_WyzEYkMEpl0SEzNluFdIPLUQVxxIATQPK1XTe1Q-2kkYKBTVMm-9jE0MvA06huiFfQ4UT5VylmLjQ5Qg3uc89-WcpuvHYQohsFwUi5KHxXyLYzsfxSE3MaSNfAh9BoQH66SOZjrd-HI8EsqticdgRoltKt7XKvMjMe3kLyo4h2dPuOr9nZ9j8WR6yGYMEFjn-gg",
  amalfi:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_79doekJ38ZbdeKV170mdGBpO_sSAH4ycgUU7-5YCE0FBulrwosNXmwWHVK-bprjymIwFvwLIpM9Lb8mjlAP5QixWdELQLNSKk38uKEiArm9qoKKGEP7YzcSv9CC4eQMUZ2a_KRMj2YUTh-uu5Eced1gv_G1JjpJq6-eO3NWpuYJlooWzwRWBM7vxRU4bWS23pvnop88oTNbAkoVe5WKE2bz9m2YYQ3MuFcY5X1NtZNHRMQ_1vWWW6g",
  kyoto:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDxTv-rJ4WQle6kvWAxWTGnvIJ1xLtdMkNFw0d9JPZaEjRTcRH2Uc-vh0Mb26Nl39_KgqroiYvK32YsFwj7LOPRw3Pavb2wbaIxVNDel2XFKYld32bPytDUV47-1EKwi1ElEMEa9sNp6MMku0Wd-bU_Pv7tTeVe2HRCOIfr2LI7I2ahITMazSwC0rcj3YxkilD4gMjpDZINj3XmegK_lg5nHm6YH40625JcwiJa98QGLFdMnSfmXO-7Tw",
  kenya:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCvDfoR4QcdbM4KVYoeEo9F-TzbIFobEuc_UGPD5L5SLJJVpva25AIzz5ALzKIiW1oKf0ORkoN2xwD2cv9uPFxw9xERgqxTbfZ_1wlyzkSG7370fsOMJX630bjTnlHqsjwk53IhcmhWxyM9vXWC6gb3jhFVkohbz8Rlzk86JHibXkKqRDWZq7xL1L8z1BOu3m7jjbSm2M43CBnTrROJQCd6rh_28P3XIu6YIqxFtvhjS5or4R292oTDGA",
  maldives:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBA-AA3IvgSfIx4lJCF3hoWqDlORjvmPzuu_raSKIBHbVy3QTord9U_QWMlKL9P2dnV3w3h8ySnBPrwq4Ak0dlE_i7Nuo6naYDncc0HFuRIqhsWyC4sDn7MJc0JniM-NQ9aYSANicuR9C3LSBMTklR6SGfPKjMH3Q_qgWCUy82ztRwti_avW1uRN26THoAscXgkvPZLgXDFRb4IH7CPiU5QFh80zar4nRHboYj5g41xlIifw9Mq1q0xEQ",
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcjlDroTYEiyeooh3V2m8W0Ee_OMhC9vTxdD8AoFFy_ZInFN39JaJFD3IzRhtc5B4z6B53cB6fJlZaZVmZrZKc6nnYOr7pbxOGFzIUY7_C76c-Vw0YMvzsLc3l4u_NW5D8hG2f9paCAw8jAGnnNetyMK_4Y3pdpv3QMbQdt-iVJt9gZvAcAmtXlhObl7igbUWY_1wp2TCOfOKKDGhVp2sG0yZ_X79W72YjLEByYQYPBPlr_6pvvZuOlQ",
};

export const heroImage = img.hero;
export const maldivesImage = img.maldives;

export const packages: TourPackage[] = [
  {
    slug: "bali-tropical-bliss",
    title: "Bali Tropical Bliss & Ubud Villas",
    region: "International",
    duration: "7 Days / 6 Nights",
    nights: 6,
    days: 7,
    location: "Ubud & Seminyak",
    tier: "Deluxe",
    price: 1299,
    originalPrice: 1699,
    currency: "USD",
    rating: 4.9,
    reviews: 128,
    summary:
      "Private pool villa, curated sunrise volcano trek, spa indulgence, and private temple blessings.",
    image: img.bali,
    gallery: [img.bali, img.maldives, img.kerala],
    featured: true,
    itinerary: [
      { day: "Day 1", title: "Arrival in Denpasar", body: "Private transfer to your Ubud pool villa. Welcome ceremony and sunset rice-terrace walk." },
      { day: "Day 2", title: "Temple blessings", body: "Private Tirta Empul purification and artisan village circuit with a local historian." },
      { day: "Day 3", title: "Volcano sunrise", body: "Optional Mount Batur trek or sunrise yoga, then spa recovery at the villa." },
      { day: "Day 4", title: "Seminyak coast", body: "Transfer to Seminyak. Beach club lunch and boutique shopping with a stylist." },
      { day: "Day 5", title: "Uluwatu cliffs", body: "Cliff temples, kecak sunset performance, and candlelight seafood dinner." },
      { day: "Day 6", title: "Free day / Nusa", body: "Optional Nusa Penida boat or full spa day. Private dinner in the villa." },
      { day: "Day 7", title: "Departure", body: "Late checkout where available and chauffeur transfer to the airport." },
    ],
    inclusions: [
      "6 nights deluxe private pool villa",
      "Daily breakfast and 3 private dinners",
      "All private AC transfers",
      "Temple offerings and licensed guide",
    ],
    exclusions: ["International flights", "Travel insurance", "Personal spa extras"],
    stays: [
      { name: "Ubud Jungle Pool Villa", place: "Ubud", image: img.bali },
      { name: "Seminyak Coast Suite", place: "Seminyak", image: img.maldives },
    ],
  },
  {
    slug: "swiss-alpine",
    title: "Swiss Alpine Majesty & Glacier Express",
    region: "International",
    duration: "8 Days / 7 Nights",
    nights: 7,
    days: 8,
    location: "Zermatt & St. Moritz",
    tier: "Super Deluxe",
    price: 3499,
    originalPrice: 4200,
    currency: "USD",
    rating: 5,
    reviews: 94,
    summary:
      "First-class Excellence Class rail, 5-star mountain chalet spa, and private Matterhorn helicopter pass.",
    image: img.swiss,
    gallery: [img.swiss, img.hero, img.kenya],
    featured: true,
    itinerary: [
      { day: "Day 1", title: "Zurich arrival", body: "First-class rail to Zermatt and check-in at a 5-star chalet spa." },
      { day: "Day 2", title: "Matterhorn", body: "Gornergrat panorama and optional helicopter circuit." },
      { day: "Day 3", title: "Glacier Express", body: "Excellence Class carriage to St. Moritz with lunch service." },
      { day: "Day 4", title: "Engadin", body: "Lake walks, private spa, and alpine dining." },
      { day: "Day 5", title: "Bernina", body: "Scenic Bernina line day trip with a dedicated host." },
      { day: "Day 6", title: "Free alpine day", body: "Ski, spa, or chocolate atelier by request." },
      { day: "Day 7", title: "Lucerne", body: "Transfer via lakeside Lucerne with a private boat hour." },
      { day: "Day 8", title: "Departure", body: "Rail to Zurich Airport in first class." },
    ],
    inclusions: ["7 nights 5-star chalets", "Glacier Express Excellence Class", "Daily breakfast", "Private transfers"],
    exclusions: ["International flights", "Ski equipment"],
    stays: [
      { name: "Zermatt Chalet Spa", place: "Zermatt", image: img.swiss },
      { name: "St. Moritz Palace Wing", place: "St. Moritz", image: img.hero },
    ],
  },
  {
    slug: "kerala-backwaters",
    title: "Kerala Backwaters & Munnar Tea Mist",
    region: "Domestic",
    duration: "6 Days / 5 Nights",
    nights: 5,
    days: 6,
    location: "Munnar & Alleppey",
    tier: "Standard",
    price: 699,
    originalPrice: 850,
    currency: "USD",
    rating: 4.8,
    reviews: 112,
    summary:
      "Dedicated private houseboat chef, organic tea plantation estate bungalow, and Ayurvedic therapies.",
    image: img.kerala,
    gallery: [img.kerala, img.bali, img.maldives],
    featured: true,
    itinerary: [
      { day: "Day 1", title: "Cochin to Munnar", body: "Hill transfer and tea-estate bungalow check-in." },
      { day: "Day 2", title: "Tea trails", body: "Plantation walk, tasting, and Ayurvedic therapy." },
      { day: "Day 3", title: "Alleppey houseboat", body: "Private kettuvallam with chef and overnight cruise." },
      { day: "Day 4", title: "Backwaters", body: "Village canals, birding, and sundowner on deck." },
      { day: "Day 5", title: "Fort Kochi", body: "Heritage walk, spice markets, and harbour sunset." },
      { day: "Day 6", title: "Departure", body: "Airport transfer from Cochin." },
    ],
    inclusions: ["5 nights hotels + houseboat", "Private chef on boat", "All transfers", "Daily breakfast"],
    exclusions: ["Flights", "Optional Kathakali show"],
    stays: [
      { name: "Munnar Tea Bungalow", place: "Munnar", image: img.kerala },
      { name: "Private Houseboat", place: "Alleppey", image: img.kerala },
    ],
  },
  {
    slug: "rajasthan-palaces",
    title: "Rajasthan Palaces & Desert Safari",
    region: "Domestic",
    duration: "9 Days / 8 Nights",
    nights: 8,
    days: 9,
    location: "Jaipur & Udaipur",
    tier: "Deluxe",
    price: 1450,
    originalPrice: 1850,
    currency: "USD",
    rating: 4.9,
    reviews: 86,
    summary:
      "Stay inside heritage royal fortresses, private desert dining under lanterns, and personal vintage car tour.",
    image: img.rajasthan,
    gallery: [img.rajasthan, img.hero, img.swiss],
    featured: true,
    itinerary: [
      { day: "Day 1", title: "Jaipur", body: "Palace hotel check-in and vintage car old-city circuit." },
      { day: "Day 2", title: "Amber & ateliers", body: "Fort, block-print studio, and rooftop dinner." },
      { day: "Day 3", title: "Jodhpur", body: "Blue city and Mehrangarh with a historian." },
      { day: "Day 4", title: "Jaisalmer", body: "Sandstone fort and lanterned dune camp." },
      { day: "Day 5", title: "Desert", body: "Camel trails and private dune dining." },
      { day: "Day 6", title: "Udaipur", body: "Lake palace views and sunset boat." },
      { day: "Day 7", title: "Udaipur leisure", body: "Spa morning and city palaces." },
      { day: "Day 8", title: "Free day", body: "Optional countryside picnic." },
      { day: "Day 9", title: "Departure", body: "Airport transfer." },
    ],
    inclusions: ["8 nights heritage hotels", "Private chauffeur", "Desert camp dinner", "Daily breakfast"],
    exclusions: ["Flights", "Monument camera fees"],
    stays: [
      { name: "Jaipur Palace Wing", place: "Jaipur", image: img.rajasthan },
      { name: "Desert Tented Camp", place: "Jaisalmer", image: img.rajasthan },
    ],
  },
  {
    slug: "amalfi-yachting",
    title: "Amalfi Coast & Capri Private Yachting",
    region: "International",
    duration: "8 Days / 7 Nights",
    nights: 7,
    days: 8,
    location: "Italy",
    tier: "Super Deluxe",
    price: 4850,
    currency: "USD",
    rating: 4.9,
    reviews: 41,
    summary:
      "Chartering from Naples to Positano with private sommelier tastings in Ravello clifftop gardens.",
    image: img.amalfi,
    gallery: [img.amalfi, img.hero, img.maldives],
    latest: true,
    latestBadge: "Private Yacht Allotment",
    itinerary: [
      { day: "Day 1", title: "Naples", body: "Arrival and transfer to Positano clifftop suite." },
      { day: "Day 2", title: "Capri yacht", body: "Private Riva-style day charter to Capri." },
      { day: "Day 3", title: "Ravello", body: "Garden tastings with a sommelier." },
      { day: "Day 4", title: "Amalfi", body: "Cathedral, paper ateliers, and lemon groves." },
      { day: "Day 5", title: "At sea", body: "Full-day yacht with swim stops." },
      { day: "Day 6", title: "Leisure", body: "Spa or walking the Sentiero degli Dei." },
      { day: "Day 7", title: "Farewell dinner", body: "Private terrace dinner over the coast." },
      { day: "Day 8", title: "Departure", body: "Transfer to Naples Airport." },
    ],
    inclusions: ["7 nights cliff suites", "Private yacht days", "Selected dinners", "Transfers"],
    exclusions: ["International flights"],
    stays: [{ name: "Positano Cliff Suite", place: "Positano", image: img.amalfi }],
  },
  {
    slug: "kyoto-tokyo",
    title: "Kyoto & Tokyo Cherry Blossom Discovery",
    region: "International",
    duration: "9 Days / 8 Nights",
    nights: 8,
    days: 9,
    location: "Japan",
    tier: "Deluxe",
    price: 3920,
    currency: "USD",
    rating: 4.8,
    reviews: 67,
    summary:
      "Private tea ceremonies with Geiko masters, Shinkansen Gran Class passes, and Michelin omakase tables.",
    image: img.kyoto,
    gallery: [img.kyoto, img.bali, img.swiss],
    latest: true,
    latestBadge: "Sakura Season 2026",
    itinerary: [
      { day: "Day 1", title: "Tokyo", body: "Ginza hotel and evening orientation." },
      { day: "Day 2", title: "Tokyo craft", body: "Tsukiji, galleries, and omakase." },
      { day: "Day 3", title: "Hakone", body: "Onsen ryokan and lake cruise." },
      { day: "Day 4", title: "Kyoto Gran Class", body: "Shinkansen to Kyoto machiya stay." },
      { day: "Day 5", title: "Temples", body: "Private dawn at selected gardens." },
      { day: "Day 6", title: "Tea & Geiko", body: "Tea ceremony and Gion evening." },
      { day: "Day 7", title: "Nara", body: "Day trip and kaiseki dinner." },
      { day: "Day 8", title: "Free Kyoto", body: "Shopping or bamboo groves." },
      { day: "Day 9", title: "Departure", body: "Transfer to KIX or ITM." },
    ],
    inclusions: ["8 nights luxury stays", "Gran Class rail", "Selected dining", "Guides"],
    exclusions: ["International flights"],
    stays: [{ name: "Kyoto Machiya Residence", place: "Kyoto", image: img.kyoto }],
  },
  {
    slug: "kenya-mara",
    title: "Kenyan Mara Great Migration Safari",
    region: "International",
    duration: "7 Days / 6 Nights",
    nights: 6,
    days: 7,
    location: "Kenya",
    tier: "Super Deluxe",
    price: 5200,
    currency: "USD",
    rating: 5,
    reviews: 58,
    summary:
      "Bush plane transfers, premier tented suites perched over the Mara River, and dawn hot-air balloon flights.",
    image: img.kenya,
    gallery: [img.kenya, img.rajasthan, img.hero],
    featured: true,
    latest: true,
    latestBadge: "River Crossing Window",
    itinerary: [
      { day: "Day 1", title: "Nairobi", body: "Giraffe Manor-style welcome and overnight." },
      { day: "Day 2", title: "Bush flight", body: "Mara tented suite and evening game drive." },
      { day: "Day 3", title: "Migration", body: "Full-day river crossing window." },
      { day: "Day 4", title: "Balloon", body: "Dawn balloon and champagne breakfast." },
      { day: "Day 5", title: "Conservancy", body: "Walking safari with a veteran zoologist." },
      { day: "Day 6", title: "Leisure", body: "Spa and sundowner." },
      { day: "Day 7", title: "Departure", body: "Bush flight to Nairobi connections." },
    ],
    inclusions: ["6 nights tented suites", "Bush flights", "All safari meals", "Balloon flight"],
    exclusions: ["International flights", "Visa"],
    stays: [{ name: "Mara River Tented Suite", place: "Masai Mara", image: img.kenya }],
  },
];

packages.push(
  ...([
    ["gangtok-pelling-darjeeling", "Gangtok Pelling Darjeeling Package Tour", "North East", img.swiss],
    ["darjeeling", "Darjeeling Tour Package", "North East", img.swiss],
    ["gangtok-pelling-ravangla", "Gangtok Pelling Ravangla", "North East", img.swiss],
    ["north-sikkim", "North Sikkim", "North East", img.swiss],
    ["silk-route", "Silk Route", "North East", img.swiss],
    ["shillong-cherrapunjee", "Shillong Cherrapunjee Package Tour", "North East", img.kerala],
    ["kaziranga", "Assam Meghalaya Kaziranga", "North East", img.kenya],
    ["arunachal", "Arunachal Pradesh", "North East", img.kenya],
    ["dooars", "Dooars Tour", "Dooars", img.kerala],
    ["dooars-4n5d", "Dooars 4N/5D Tour Package", "Dooars", img.kerala],
    ["kashmir", "Kashmir Tour Package", "Kashmir", img.swiss],
    ["kashmir-premium", "Premium Kashmir Package", "Kashmir", img.swiss],
    ["leh-ladakh", "Leh Ladakh Tour Package", "Kashmir", img.swiss],
    ["nainital", "Nainital Package", "Uttarakhand", img.kerala],
    ["shimla-manali", "Shimla-Manali Package", "Himachal", img.swiss],
    ["andaman-havelock", "Portblair Havelock Tour Package", "Andaman", img.maldives],
    ["andaman", "Andaman Tour Package", "Andaman", img.maldives],
    ["goa", "Goa Tour Packages", "Goa", img.amalfi],
  ] as const).map(([slug, title, region, image]) => ({
    slug,
    title,
    region,
    duration: "6 Days / 5 Nights",
    nights: 5,
    days: 6,
    location: region,
    tier: "Deluxe" as const,
    price: 899,
    originalPrice: 1099,
    currency: "USD",
    rating: 4.8,
    reviews: 42,
    summary: `Handcrafted ${title.toLowerCase()} with private transfers, curated stays, and a dedicated Bijali concierge.`,
    image,
    gallery: [image, img.hero, img.bali],
    itinerary: [
      { day: "Day 1", title: "Arrival", body: "Meet-and-greet and hotel transfer." },
      { day: "Day 2", title: "Sightseeing", body: "Guided highlights with flexible pacing." },
      { day: "Day 3", title: "Excursion", body: "Signature landscape day with private vehicle." },
      { day: "Day 4", title: "Leisure", body: "Optional activities or spa time." },
      { day: "Day 5", title: "Local life", body: "Markets, cuisine, and sunset viewpoint." },
      { day: "Day 6", title: "Departure", body: "Airport or railway transfer." },
    ],
    inclusions: ["Hotels with breakfast", "Private AC vehicle", "Licensed guide days"],
    exclusions: ["Flights / trains", "Personal expenses"],
    stays: [{ name: "Signature stay", place: region, image }],
  })),
);

export function getPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}

export function formatPrice(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export const faqs = [
  {
    q: "Do you assist with tourist visa processing and flight ticketing?",
    a: "Yes. Bijali Tours & Travels is an accredited IATA agency. Our concierge documentation desk manages tourist visa applications, consular appointments, and flight ticketing coordinated with your hotel check-ins.",
  },
  {
    q: "Can I upgrade from Standard to Deluxe or Super Deluxe during the trip?",
    a: "Subject to lodge and private charter availability, our 24/7 travel desk can upgrade individual days, suites, or flight legs mid-journey. Any price difference is processed through your dedicated payment link.",
  },
  {
    q: "What is your cancellation and reschedule policy?",
    a: "Cancellations made up to 30 days prior to departure receive a 100% travel credit valid for 24 months, or an 85% direct refund. Rescheduling dates within the same seasonal tier carries zero administrative penalty.",
  },
  {
    q: "How flexible are the daily sightseeing schedules in customized tours?",
    a: "Completely flexible. Because your chauffeur and tour guide are privately designated to your party, you may delay your morning start or swap an excursion with a message to your concierge.",
  },
];

export const testimonials = [
  {
    name: "Lord Julian Harrington",
    trip: "Visited: Swiss Alps • Super Deluxe Tour",
    quote:
      "The Glacier Express Excellence Class tickets were impossible to acquire, but Bijali had them secured in 48 hours. Our private chalet concierge in Zermatt made us feel like royalty.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCAWCDs-OJkH0xDTxhybVuKjfg8Jxd0rRXhYQFXSmDhM64xam4ID1BWcA8Tnf-w3-RL_dBsQO_wjnBQ7aAMlpnkFQ0njcKRNlkQj3my_V510OtlaRRDxYTyFdWJIM0JDr7g6fRj8amUI2OGV3vTsqks7TDXa1rzRkqG_TadGY8lC1NfSwZa4CdoTHXOPf80Qxc0ZADZu1gFIht1wuZUkQZo6b9Vt6dCGKx7E1hMYgV2LkxYiPA8Yu8mnA",
  },
  {
    name: "Dr. Priya & Ryan Chen",
    trip: "Visited: Kerala Backwaters • Deluxe Tour",
    quote:
      "From our personal chef aboard the Alleppey houseboat to private sunrise yoga facing the mist in Munnar, every single detail felt handcrafted specifically for our anniversary.",
    image: img.bali,
  },
  {
    name: "Camilla Sorensen",
    trip: "Visited: Kenya Serengeti • Super Deluxe Tour",
    quote:
      "Our safari guide in the Serengeti was a veteran zoologist. He positioned our vehicle right in front of the Mara river crossing before any crowd gathered. Unforgettable experience.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNTugSIEIRTtL-QuRJAiEK5Y2P6GtsKirNOGXUymMyuqrNsyZmhOIrEgyxWtYDepT6alxPMT9ZlmQCkK9uyGi_pJo757uIHVsacURj2x4t2A0PXbCENvwZMyZc_8gHTPEqnc-E-4pI8WMxNuDQAxoO_b3lEZ0rcc3-5hSdeZQR3OHcqYh86oPU0BQhWWp2dcgU8T-vz4Gq7wMrFUvFLOwQ6RUxiVWEUd-GMOtuxChiNG-yRqj4VNNjpg",
  },
];
