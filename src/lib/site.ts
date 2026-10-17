export const site = {
  name: "Bijali Tours & Travels",
  shortName: "Bijali",
  email: "booking@bijalitours.com",
  phone: ["+", "91 98300 00000"].join(""),
  phoneAlt: "+1 (800) 592-LUXE",
  phoneTel: "+18005925893",
  whatsapp: "https://wa.me/919830000000",
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAggu-6n4hIwKM5npyXpB8lYAlT2Ipa44WtIupVSVNpxKGiZ6hNq9fG5Yib3cdWdn1E8axrxFwnc-tVAyk6cJXWcEc49hozKsuBH54-ptdg46QgumwjgV3qaMGSMnHOCBntfPmrIeXGV9c-JZMUJSL_mNapTEt7UmSlwo-Cu0xG-ehtnUDkfb_6T18KsbTdKJ6ci3hFM8oSUp6zA8kwhiyi3xpPK01Slq-XzL9A47O_HNzOeYa2MaXcdQSCLGxpOQxtzc0",
  advisor:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gT8gy8NOSUPFp0fTzJneoSCWuBF9i87-D-lvR05aA-sbL5R1SdTAUliLHUCIJ99tLC-oUQmQbVnrba3Y7Desa2mK-6IZgWL2ZQpJVQ-OuHbs9Nl0G38HNQ-D3rKA-E_7Tjvetcw-VHj8fK_FcQPnzhgwWWcjyE3S-KC1NN7PPo1pE825Wr8NP_xqZvC2UlDjuBQTwTlPo65b1jtbD76sVm-hxuX3VMkHM6r7zu4TJy5gTIRwl4XwtQ",
};

export type MegaLink = { label: string; href: string; accent?: "amber" | "cyan" };

export const domesticMenu: {
  title: string;
  icon: string;
  links: MegaLink[];
}[] = [
  {
    title: "North East India",
    icon: "landscape",
    links: [
      { label: "Gangtok Pelling Darjeeling Package Tour", href: "/packages/gangtok-pelling-darjeeling" },
      { label: "Darjeeling Tour Package", href: "/packages/darjeeling" },
      { label: "Gangtok Pelling Ravangla", href: "/packages/gangtok-pelling-ravangla" },
      { label: "North Sikkim", href: "/packages/north-sikkim" },
      { label: "Silk Route", href: "/packages/silk-route" },
      { label: "Shillong Cherrapunjee Package Tour", href: "/packages/shillong-cherrapunjee" },
      { label: "Assam Meghalaya Kaziranga", href: "/packages/kaziranga" },
      { label: "Arunachal Pradesh", href: "/packages/arunachal" },
    ],
  },
  {
    title: "Dooars",
    icon: "nature_people",
    links: [
      { label: "Dooars Tour", href: "/packages/dooars" },
      { label: "Dooars 4N/5D Tour Package", href: "/packages/dooars-4n5d" },
    ],
  },
  {
    title: "Jammu & Kashmir",
    icon: "ac_unit",
    links: [
      { label: "Kashmir Tour Package", href: "/packages/kashmir" },
      { label: "Premium Kashmir Package", href: "/packages/kashmir-premium" },
      { label: "Leh Ladakh Tour Package", href: "/packages/leh-ladakh" },
    ],
  },
  {
    title: "Uttarakhand & Himachal",
    icon: "temple_hindu",
    links: [
      { label: "Nainital Package", href: "/packages/nainital" },
      { label: "Shimla-Manali Package", href: "/packages/shimla-manali" },
    ],
  },
  {
    title: "Andaman & Goa",
    icon: "scuba_diving",
    links: [
      { label: "Portblair Havelock Tour Package", href: "/packages/andaman-havelock" },
      { label: "Andaman Tour Package", href: "/packages/andaman" },
      { label: "Goa Tour Packages", href: "/packages/goa", accent: "cyan" },
    ],
  },
  {
    title: "South India & Rajasthan",
    icon: "sailing",
    links: [
      { label: "Kerala Tour Packages 6N–7D", href: "/packages/kerala-backwaters" },
      { label: "Kerala Premium Package", href: "/packages/kerala-premium" },
      { label: "Rajasthan Tour Package", href: "/packages/rajasthan-palaces", accent: "cyan" },
    ],
  },
];

export const weekendHolidays = [
  { label: "Digha & Mandarmani", href: "/packages?region=weekend" },
  { label: "Sundarban Weekend", href: "/packages?region=weekend" },
  { label: "Puri Konark", href: "/packages?region=weekend" },
];

export const internationalMenu = [
  { label: "Bali Tropical Bliss", href: "/packages/bali-tropical-bliss" },
  { label: "Swiss Alpine Majesty", href: "/packages/swiss-alpine" },
  { label: "Amalfi Coast Yachting", href: "/packages/amalfi-yachting" },
  { label: "Kenya Mara Safari", href: "/packages/kenya-mara" },
  { label: "Kyoto Cherry Blossom", href: "/packages/kyoto-tokyo" },
];
