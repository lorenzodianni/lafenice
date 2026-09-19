// Single source for business facts: UI, JSON-LD, sitemap and llms.txt read from here.
// PLACEHOLDER marks values copied from the mockup that the client must confirm
// (see worklog.md).

export const site = {
  url: "https://www.lafenice-estetica.it", // PLACEHOLDER: domain not confirmed
  name: "La Fenice",
  legalName: "Centro Estetico La Fenice", // PLACEHOLDER
  vatId: "00000000000", // PLACEHOLDER
  kind: "Centro Estetico",
  description:
    "Centro estetico a Novara: trattamenti viso e corpo su misura, massaggi, epilazione e make-up in uno spazio dove prendersi cura di sé è un rito.",
  foundingYear: 2014, // PLACEHOLDER
  owner: { name: "Micaela Brunetti", role: "Titolare ed estetista" },
  address: {
    street: "Via Esempio 12", // PLACEHOLDER
    postalCode: "28100",
    city: "Novara",
    province: "NO",
    country: "IT",
  },
  phone: "+39 0321 000 000", // PLACEHOLDER
  whatsapp: "", // PLACEHOLDER: empty = hidden
  email: "info@lafenice-estetica.it", // PLACEHOLDER
  ordersEmail: "ordini@lafenice-estetica.it", // PLACEHOLDER: receives preorders
  // PLACEHOLDER. schema.org day names; labels and closed days are derived below.
  hours: [
    {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    { days: ["Saturday"], opens: "09:00", closes: "17:00" },
  ],
  // Keys are the labels shown in the footer.
  social: { Instagram: "", Facebook: "" }, // PLACEHOLDER: empty = hidden
};

export const treatments = [
  {
    name: "Viso",
    description:
      "Pulizie profonde, trattamenti illuminanti e protocolli anti-età personalizzati.",
    duration: "da 45 min",
  },
  {
    name: "Corpo",
    description:
      "Trattamenti rassodanti, drenanti e rituali di idratazione per una pelle rinnovata.",
    duration: "da 60 min",
  },
  {
    name: "Mani & Piedi",
    description:
      "Manicure e pedicure curative ed estetiche, con finiture semipermanenti.",
    duration: "da 40 min",
  },
  {
    name: "Epilazione",
    description:
      "Ceretta e trattamenti delicati, con attenzione alle pelli più sensibili.",
    duration: "da 20 min",
  },
  {
    name: "Massaggi",
    description:
      "Rilassanti, decontratturanti e drenanti per sciogliere tensioni e ritrovare leggerezza.",
    duration: "da 50 min",
  },
  {
    name: "Make-up",
    description:
      "Trucco giorno, evento e spose, con consulenza personalizzata sui tuoi tratti.",
    duration: "su appuntamento",
  },
];

export const cityLine = `${site.address.postalCode} ${site.address.city} (${site.address.province})`;
export const fullAddress = `${site.address.street}, ${cityLine}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.name} ${fullAddress}`)}`;
export const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;
export const whatsappHref =
  site.whatsapp && `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`;
export const socialLinks = Object.entries(site.social).filter(([, url]) => url);

const dayNames: Record<string, string> = {
  Monday: "Lun",
  Tuesday: "Mar",
  Wednesday: "Mer",
  Thursday: "Gio",
  Friday: "Ven",
  Saturday: "Sab",
  Sunday: "Dom",
};
const hhmm = (t: string) => t.replace(/^0/, "");

// ponytail: a multi-day entry is shown as a "first - last" range, so its days
// must be consecutive. Split the entry if they ever are not.
export const openingHours = site.hours.map((h) => {
  const first = dayNames[h.days[0]];
  const last = dayNames[h.days[h.days.length - 1]];
  return {
    days: first === last ? first : `${first} - ${last}`,
    time: `${hhmm(h.opens)} - ${hhmm(h.closes)}`,
  };
});

export const closedDays = Object.keys(dayNames)
  .filter((d) => !site.hours.some((h) => h.days.includes(d)))
  .map((d) => dayNames[d]);
