import ceretta from "~/assets/trattamenti/ceretta.svg";
import gelUnghie from "~/assets/trattamenti/gel-unghie.svg";
import laser from "~/assets/trattamenti/laser.svg";
import manicurePedicure from "~/assets/trattamenti/manicure-pedicure.svg";
import massaggi from "~/assets/trattamenti/massaggi.svg";
import pressoterapia from "~/assets/trattamenti/pressoterapia.svg";
import puliziaViso from "~/assets/trattamenti/pulizia-viso.svg";
import semipermanente from "~/assets/trattamenti/semipermanente.svg";

// Single source for business facts: UI, JSON-LD, sitemap and llms.txt read from here.
// PLACEHOLDER marks values copied from the mockup that the client must confirm
// (see worklog.md).

export const site = {
  url: "https://www.lafenice-estetica.com", // PLACEHOLDER: .com, name not chosen yet
  name: "La Fenice",
  // Sole trader ("ditta individuale"): the legal name is the owner's own name.
  legalName: "Micaela Brunetti",
  vatId: "11407830964",
  kind: "Centro Estetico",
  description:
    "Centro estetico a Cinisello Balsamo (Milano): pulizia viso, manicure e pedicure, ricostruzione unghie, laser, ceretta, pressoterapia e massaggi su misura.",
  owner: { name: "Micaela Brunetti", role: "Titolare ed estetista" },
  // From the owner's story (Studio.tsx): "Dicembre 2020". Year only, the
  // legal opening month may differ.
  foundingYear: 2020,
  address: {
    street: "Via Luigi Pirandello 1",
    postalCode: "20092",
    city: "Cinisello Balsamo",
    province: "MI",
    country: "IT",
  },
  phone: "+39 371 457 1906",
  whatsapp: "", // PLACEHOLDER: empty = hidden
  email: "c.elafenice2020@gmail.com",
  ordersEmail: "c.elafenice2020@gmail.com", // receives preorders
  // schema.org day names; labels and closed days are derived below.
  hours: [
    {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:30",
    },
    { days: ["Saturday"], opens: "09:00", closes: "19:00" },
  ],
  // Keys are the labels shown in the footer.
  social: { Instagram: "", Facebook: "" }, // PLACEHOLDER: empty = hidden
};

// Copy from the client. Blank lines inside a description separate real
// paragraphs: the cards split on them and render one `<p>` each.
// PLACEHOLDER images: real photos pending. Imported, not public/ URLs:
// they are decorative, no JSON-LD needs their URL to stay stable.
export const treatments = [
  {
    name: "Pulizia Viso",
    image: puliziaViso,
    description:
      "Un trattamento dedicato alla detersione profonda e alla cura della pelle, ideale per eliminare impurità, cellule morte e sebo in eccesso. La pelle appare così più pulita, luminosa, morbida e fresca, pronta a ricevere al meglio i successivi trattamenti cosmetici.",
  },
  {
    name: "Manicure & Pedicure",
    image: manicurePedicure,
    description:
      "Un momento di cura e benessere dedicato a mani e piedi. Il trattamento comprende la cura delle unghie e delle cuticole, per un risultato ordinato, elegante e curato. Un piccolo rituale di bellezza per donare a mani e piedi un aspetto morbido, armonioso e impeccabile.",
  },
  {
    name: "Semipermanente Mani & Piedi",
    image: semipermanente,
    description:
      "Colore, brillantezza e cura in un unico trattamento. Il semipermanente valorizza mani e piedi con un risultato elegante, uniforme e duraturo, per un look sempre impeccabile.",
  },
  {
    name: "Gel e ricostruzione unghie",
    image: gelUnghie,
    description:
      "Un trattamento dedicato a chi desidera unghie curate, armoniose e impeccabili. Il gel permette di valorizzare la forma dell'unghia e creare un risultato elegante e personalizzato.",
  },
  {
    name: "Laser",
    image: laser,
    description:
      "Un trattamento professionale pensato per ridurre progressivamente la crescita dei peli, attraverso l'azione mirata del laser.\n\nUn percorso personalizzato in base alle caratteristiche della pelle e del pelo, per una pelle più liscia, uniforme e curata nel tempo.",
  },
  {
    name: "Ceretta",
    image: ceretta,
    description:
      "Un servizio di epilazione accurato e professionale, studiato per rimuovere i peli alla radice e lasciare la pelle liscia, uniforme e piacevolmente morbida.",
  },
  {
    name: "Pressoterapia",
    image: pressoterapia,
    description:
      "Un trattamento dedicato al benessere e alla leggerezza delle gambe. Attraverso una piacevole compressione ritmica, la pressoterapia favorisce il drenaggio dei liquidi e la circolazione, aiutando a ridurre la sensazione di pesantezza e donando una piacevole sensazione di leggerezza.\n\nUn momento di relax e benessere ideale per prendersi cura delle proprie gambe.",
  },
  {
    name: "Massaggi",
    image: massaggi,
    description:
      "Un momento dedicato al benessere, per sciogliere le tensioni, ritrovare leggerezza e concedersi una piacevole pausa dedicata a te stessa.\n\nMassaggi decontratturanti schiena, benessere corpo, linfodrenanti e rimodellanti, pensati e personalizzati in base alle esigenze del corpo.",
  },
];

export const cityLine = `${site.address.postalCode} ${site.address.city} (${site.address.province})`;
export const fullAddress = `${site.address.street}, ${cityLine}`;
// A screenshot of the salon's street: redo it if the address changes.
export { default as mapImage } from "~/assets/mappa.webp";
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
