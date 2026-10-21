import type { LegalSection } from "@/components/legal-document";

export const legalUpdated = "19 October 2026";

type Contact = {
  brandName: string;
  email: string;
  phone: string;
};

function desk(contact: Contact) {
  return `${contact.brandName}, email ${contact.email}, phone ${contact.phone}. The grievance officer uses the same desk.`;
}

export function termsSections(contact: Contact): LegalSection[] {
  return [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        {
          type: "p",
          text: `These Terms & Conditions govern use of this website. Tour quotations, payments, and travel services are also governed by the Terms of Booking. ${desk(contact)}`,
        },
        {
          type: "p",
          text: "We are a tour operator and travel arranger based in India. We design itineraries and book hotels, transport, guides, permits, and, when you ask, flights and visa support through suppliers. We are not the airline, hotel, or consulate.",
        },
      ],
    },
    {
      id: "using-the-site",
      title: "Using the website",
      blocks: [
        {
          type: "p",
          text: "You must be able to form a contract under the Indian Contract Act, 1872. If you enquire for someone else, you confirm you have their authority to share their details and to receive our replies.",
        },
        {
          type: "ul",
          items: [
            "Do not misuse the forms, scrape the site, or attempt to break into the admin console.",
            "Do not post unlawful, misleading, or infringing material.",
            "Package prices, hotel names, and departure dates on the site are invitations to enquire. They become binding only when a quotation is accepted under the Terms of Booking.",
          ],
        },
      ],
    },
    {
      id: "accounts-and-enquiries",
      title: "Enquiries, payments, and newsletters",
      blocks: [
        {
          type: "p",
          text: "Information you send through the enquiry form, payment portal, or newsletter box must be accurate. We use it to reply, to arrange travel, and, if you subscribe, to send trip notes. The Privacy & Data Rights page explains the personal data we keep and the rights you have under the Digital Personal Data Protection Act, 2023.",
        },
      ],
    },
    {
      id: "intellectual-property",
      title: "Our content",
      blocks: [
        {
          type: "p",
          text: "Text, itineraries, photographs, logos, and layout on this website belong to us or to our licensors. You may share a link. You may not copy a package description or photograph for your own commercial use without written permission.",
        },
      ],
    },
    {
      id: "third-parties",
      title: "Other websites",
      blocks: [
        {
          type: "p",
          text: "Links to WhatsApp, banks, airlines, or partner sites leave our control. Their terms and privacy notices apply once you are there. A partner logo on this site means a commercial relationship, not that we control that partner.",
        },
      ],
    },
    {
      id: "liability",
      title: "Liability for the website",
      blocks: [
        {
          type: "p",
          text: "We take care to keep the website available and the public information current. We do not promise uninterrupted access. To the extent Indian law allows, we are not liable for loss caused only by a temporary site outage, a failed form submission, or reliance on a price that a quotation later corrects.",
        },
        {
          type: "p",
          text: "Nothing on this page limits liability for fraud, or any liability that the Consumer Protection Act, 2019 does not allow us to exclude. Travel services themselves are covered by the Terms of Booking.",
        },
      ],
    },
    {
      id: "law",
      title: "Law and grievances",
      blocks: [
        {
          type: "p",
          text: "Indian law governs these Terms. Courts at the place of our principal business in India have jurisdiction, without taking away a consumer’s right to approach the consumer commission that has jurisdiction under the Consumer Protection Act, 2019.",
        },
        {
          type: "p",
          text: `Write to ${contact.email} with the subject “Website grievance”. We acknowledge the message and aim to reply within 30 days. If you are in the European Economic Area or the United Kingdom, read the GDPR page as well.`,
        },
      ],
    },
  ];
}

export function privacySections(contact: Contact): LegalSection[] {
  return [
    {
      id: "fiduciary",
      title: "Data fiduciary",
      blocks: [
        {
          type: "p",
          text: `${contact.brandName} is the data fiduciary for personal data collected on this website, under the Digital Personal Data Protection Act, 2023 (“DPDP Act”). We also follow the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 where they still apply.`,
        },
        {
          type: "p",
          text: desk(contact),
        },
      ],
    },
    {
      id: "what-we-collect",
      title: "Personal data we collect",
      blocks: [
        {
          type: "ul",
          items: [
            "Enquiry: name, phone, email, trip type, destination, package tier, preferred month, and the page you submitted from.",
            "Payment proof: the same contact details, travel date, amount, UTR or UPI reference, and the screenshot you upload.",
            "Newsletter: email address.",
            "Technical data: browser type, approximate time, and the page address, which our host and our enquiry platform receive so the form can be delivered and abuse can be blocked.",
            "Booking file, once you confirm: traveller names, ages where a child fare applies, ID or passport details the supplier needs, and special requests you choose to tell us (rooms, meals, accessibility).",
          ],
        },
        {
          type: "p",
          text: "We do not ask you to store card numbers on this website. Bank and UPI payments are made on your bank’s own channel. Do not send passwords or full card data by email or WhatsApp.",
        },
      ],
    },
    {
      id: "purposes",
      title: "Why we use it",
      blocks: [
        {
          type: "ul",
          items: [
            "To answer your enquiry and prepare a quotation.",
            "To perform a booking: hotels, cars, guides, permits, flights, and visa packs you have asked for.",
            "To match a payment screenshot to a booking and issue a voucher or GST invoice.",
            "To send operational messages about your trip on email, phone, or WhatsApp.",
            "To send occasional trip notes if you subscribed, until you unsubscribe.",
            "To meet tax, accounting, and consumer-law record duties.",
            "To secure the website and investigate misuse.",
          ],
        },
        {
          type: "p",
          text: "Submitting an enquiry or payment proof is your consent for those booking purposes. Subscribing is your consent for marketing email. We do not sell personal data, and we do not use it to train public AI models.",
        },
      ],
    },
    {
      id: "sharing",
      title: "Who we share it with",
      blocks: [
        {
          type: "ul",
          items: [
            "Suppliers who must deliver the trip: hotels, transporters, guides, airlines, insurers, and permit offices. They receive only what that booking needs.",
            "Our customer-relationship platform (1inall), which stores enquiry and payment-proof submissions so the desk can reply.",
            "Our website host, email provider, and bank, acting on our instructions or on yours when you pay.",
            "Authorities, if a law, court, or tax officer requires it.",
          ],
        },
        {
          type: "p",
          text: "International trips mean some of this data is sent to hotels or airlines outside India. That transfer is limited to what the booking needs. The DPDP Act allows transfers except to countries the Central Government restricts. The GDPR page explains the extra safeguards for people in the EU, EEA, and UK.",
        },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        {
          type: "p",
          text: "We do not knowingly take a booking from a child. A parent or legal guardian must submit the enquiry and consent to our use of a traveller’s data when that traveller is under 18. We use a child’s data only to arrange their travel and to meet legal duties such as permits and tickets.",
        },
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      blocks: [
        {
          type: "ul",
          items: [
            "Unconfirmed enquiries: until you ask us to delete them, or 24 months after our last reply, whichever comes first.",
            "Confirmed bookings, invoices, and payment proofs: for the period Indian tax and company law requires, generally up to eight years after the financial year of the trip.",
            "Newsletter addresses: until you unsubscribe.",
            "Staff console session cookies: only for that signed-in session.",
          ],
        },
      ],
    },
    {
      id: "rights",
      title: "Your rights under Indian law",
      blocks: [
        {
          type: "p",
          text: "As a data principal you may ask us for a summary of the personal data we hold and the people we have shared it with, to correct or complete it, to erase it when the law allows, to withdraw consent, and to nominate another person to exercise these rights if you die or become unable to do so. Withdrawal does not undo use that was already lawful, and we may keep records we are legally required to keep.",
        },
        {
          type: "p",
          text: `Email ${contact.email} with the subject “Data request”, from the address you used with us, and say what you want. We may ask for enough detail to be sure it is you. We aim to complete the request within 30 days. If you are unhappy with the reply, you may complain to the Data Protection Board of India once that route is open for your complaint.`,
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "p",
          text: "The public site is served over HTTPS. Enquiry and payment uploads are sent to our desk through an authenticated server connection. Access to booking files is limited to staff who need them. These are our reasonable security practices. No method of transmission is perfectly secure; tell us at once if you think an email or form about your trip was compromised.",
        },
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      blocks: [
        {
          type: "p",
          text: "The public website does not set advertising or analytics cookies. The staff console uses one strictly necessary session cookie after an employee signs in. You can block cookies in your browser; the public enquiry and payment forms still work.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes",
      blocks: [
        {
          type: "p",
          text: "If we change this notice, we will update the date at the top. For a confirmed booking, the notice that applied when you accepted the quotation continues to cover that trip, plus any change the law requires.",
        },
      ],
    },
  ];
}

export function gdprSections(contact: Contact): LegalSection[] {
  return [
    {
      id: "scope",
      title: "When this page applies",
      blocks: [
        {
          type: "p",
          text: `This notice adds to the Privacy & Data Rights page for people in the European Economic Area, the United Kingdom, and Switzerland. It is our Article 13 / Article 14 notice under the EU GDPR, and the same under the UK GDPR. ${contact.brandName} is the controller. Contact ${contact.email} or ${contact.phone}. We have not appointed an EU representative; write to that desk and we will handle the request.`,
        },
      ],
    },
    {
      id: "bases",
      title: "Legal bases",
      blocks: [
        {
          type: "ul",
          items: [
            "Contract (Article 6(1)(b)): preparing a quotation you asked for, and performing a booking.",
            "Legal obligation (Article 6(1)(c)): tax, accounting, and answers to lawful authority requests.",
            "Legitimate interests (Article 6(1)(f)): securing the site, preventing fraudulent payment proofs, and keeping a record of what was agreed. You may object where your situation outweighs those interests.",
            "Consent (Article 6(1)(a)): newsletter email, and any optional sensitive detail you volunteer (for example a medical or meal need). You may withdraw consent at any time.",
          ],
        },
        {
          type: "p",
          text: "Passport and permit details are used because the booking cannot be delivered without them. Please do not send health information unless the hotel or airline has asked for it.",
        },
      ],
    },
    {
      id: "transfers",
      title: "Transfers outside your country",
      blocks: [
        {
          type: "p",
          text: "We are established in India. The European Commission has not issued an adequacy decision for India. When we process your data in India, or send it to a hotel or airline in another country for your trip, we rely on the derogations in Article 49 GDPR where the transfer is necessary to perform the booking you requested, or on your explicit consent when a derogation is not available. We tell the supplier to use the data only for that service.",
        },
      ],
    },
    {
      id: "rights",
      title: "Your GDPR rights",
      blocks: [
        {
          type: "ul",
          items: [
            "Access to the personal data we hold about you.",
            "Rectification of inaccurate data.",
            "Erasure, where the law allows it.",
            "Restriction of processing in the cases Article 18 lists.",
            "Portability of data you provided, where processing is by automated means and based on contract or consent.",
            "Objection to processing based on legitimate interests, and an absolute right to object to direct marketing.",
            "Withdrawal of consent, without affecting earlier lawful processing.",
            "A complaint to your local supervisory authority or, in the UK, the Information Commissioner’s Office.",
          ],
        },
        {
          type: "p",
          text: `Email ${contact.email} with the subject “GDPR request”. We respond within one month, or we tell you why we need up to two further months on a complex request. We may need to confirm your identity before we release a file.`,
        },
      ],
    },
    {
      id: "retention-gdpr",
      title: "Retention and automated decisions",
      blocks: [
        {
          type: "p",
          text: "Retention periods are the same as on the Privacy & Data Rights page. We do not make decisions that produce legal effects about you by solely automated means. A human on the travel desk reads every enquiry and payment proof.",
        },
      ],
    },
  ];
}

export function bookingSections(contact: Contact): LegalSection[] {
  return [
    {
      id: "contract",
      title: "When a booking exists",
      blocks: [
        {
          type: "p",
          text: `A package page is an invitation to enquire. A contract is formed when you accept a written quotation from ${contact.brandName} and, where the quotation asks for it, we receive the advance. Until then, hotels and vehicles are not held. These Terms of Booking, the quotation, and any later written change together form the contract.`,
        },
        {
          type: "p",
          text: desk(contact),
        },
      ],
    },
    {
      id: "price",
      title: "Price and what it covers",
      blocks: [
        {
          type: "p",
          text: "The quotation lists what is included and what is not, such as flights, visa fees, monument tickets, meals, and personal expenses. GST is added where the law requires it and is shown on the invoice. A price on the website can change before you accept a quotation, because hotel and transport rates move.",
        },
        {
          type: "p",
          text: "After you accept, we change the price only if a supplier raises a fare or tax we could not have known, if you change the party size, dates, or hotels, or if you add services. We tell you the difference and wait for your confirmation before we collect it.",
        },
      ],
    },
    {
      id: "payment",
      title: "Payment",
      blocks: [
        {
          type: "p",
          text: "Pay the advance and the balance by the dates on the quotation, through the bank or UPI details on the Payment Portal. Upload the UTR and a screenshot so accounts can match the transfer. The booking lapses if the advance is not received by the date we stated, and we may release the hotels.",
        },
        {
          type: "p",
          text: "Air tickets, if we issue them, are usually payable in full at the time of ticketing and follow the airline’s fare rules, which are often stricter than the land-package rules below.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes you ask for",
      blocks: [
        {
          type: "p",
          text: "You may ask to move dates, change a hotel, or upgrade a tier. If the supplier confirms and the seasonal rate does not increase, we do not charge a Bijali administration fee. If the new arrangement costs more, you pay the difference we confirm in writing. Name changes follow the hotel, permit, and airline rules.",
        },
      ],
    },
    {
      id: "cancellation",
      title: "Cancellation by you",
      blocks: [
        {
          type: "p",
          text: "Count days before the departure date on the quotation, and write to us to cancel. These bands apply to money you paid to Bijali for the land arrangement:",
        },
        {
          type: "ul",
          items: [
            "30 days or more before departure: a travel credit for the full amount paid to us, valid for 24 months, or a refund of 85% of that amount. The 15% covers supplier deposits and desk costs that we do not recover.",
            "15 to 29 days before departure: a refund of 50% of the amount paid to us, unless the supplier returns more, in which case we pass that extra back after deducting non-recoverable costs.",
            "14 days or fewer, or a no-show: no refund of the land arrangement, except any amount a supplier actually returns to us.",
          ],
        },
        {
          type: "p",
          text: "Airline tickets, visa fees, permits already filed, and peak-date or festival hotels marked non-refundable on the quotation are outside these bands. Those amounts are lost to the extent the supplier will not return them, even inside the 30-day window. Refunds are sent to the original payer after the supplier settles with us, usually within 15 working days of that settlement.",
        },
      ],
    },
    {
      id: "our-changes",
      title: "Changes or cancellation by us",
      blocks: [
        {
          type: "p",
          text: "If we must change a hotel, vehicle, or timing before departure, we offer a reasonable equivalent and tell you. If the change is major and you do not accept it, you may cancel and take a full refund of money paid to us for the services we will not provide.",
        },
        {
          type: "p",
          text: "We may cancel if a minimum group is not met and the quotation said so, if a supplier withdraws, or if a government order stops the trip. We then offer a replacement or a refund of money paid to us for the services not provided. We are not liable for further loss, including flights you bought yourself, except where Indian consumer law requires otherwise.",
        },
      ],
    },
    {
      id: "travel",
      title: "On the trip",
      blocks: [
        {
          type: "ul",
          items: [
            "You are responsible for valid identity documents, passport, visa, vaccinations, and fitness to travel. We tell you the usual requirements; the final decision sits with the airline, hotel, or immigration officer.",
            "Restricted and protected areas (including parts of Sikkim, Arunachal Pradesh, and Ladakh) depend on permits. If a permit is refused for a reason outside our control, the cancellation bands above apply to the unused portion.",
            "Itinerary timings can move for weather, traffic, or wildlife. Private tours can shift a sightseeing slot when the guide and driver are assigned to your party, as long as the hotel night and the supplier’s closing time allow it.",
            "You must follow the guide’s safety instructions. We may end the arrangement without refund if a traveller is abusive, unlawful, or puts others at risk.",
            "Travel insurance is not included. Please buy cover for medical care, cancellation, and baggage before you pay the balance.",
          ],
        },
      ],
    },
    {
      id: "force-majeure",
      title: "Events outside our control",
      blocks: [
        {
          type: "p",
          text: "We are not in breach where weather, natural disaster, epidemic, war, terrorism, strike, air-traffic control, or a government order prevents a service. We will try to reroute. Money that suppliers refuse to return cannot be refunded. This does not remove any non-excludable right you have under the Consumer Protection Act, 2019.",
        },
      ],
    },
    {
      id: "complaints",
      title: "Complaints",
      blocks: [
        {
          type: "p",
          text: `Tell the guide or the 24/7 desk as soon as something goes wrong on the trip, so we can correct it. After you return, write to ${contact.email} with the subject “Booking complaint” within 30 days. Indian law applies. A consumer may also approach the consumer commission that has jurisdiction.`,
        },
      ],
    },
  ];
}
