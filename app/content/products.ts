// Field names follow the Shopify Storefront API Product, so migrating to
// Hydrogen only swaps this file for a Storefront query. Fields that Shopify
// does not have (titleAccent, tagline, delivery, shippingNote, highlights)
// would become metafields. Images live in public/: JSON-LD needs URLs that do
// not change with every build.
export const products = [
  {
    handle: "detergente-viso-nuvola",
    title: "Detergente viso Nuvola",
    titleAccent: "Nuvola", // word set in italic, as in the mockup
    tagline: "Gentle facial cleanser",
    // Blank lines separate real paragraphs: rendered as one `<p>` each.
    description:
      "Nuvola è un detergente viso delicato pensato per detergere la pelle con dolcezza, lasciandola morbida, fresca e piacevolmente idratata.\n\nLa sua formula, arricchita con Glicerina, Pantenolo, Avena colloidale, Ceramide NP ed Ectoin, deterge delicatamente rispettando il naturale equilibrio della pelle e donando una piacevole sensazione di comfort.\n\nLa texture cremosa e avvolgente trasforma la detersione in un piccolo rituale di benessere, ideale per la routine quotidiana, mattina e sera.",
    featuredImage: {
      url: "/images/detergente-viso-nuvola.svg", // PLACEHOLDER: real photo pending
      altText: "Detergente viso Nuvola",
      width: 800,
      height: 1000,
    },
    seo: {
      title: "Detergente viso Nuvola in preordine",
      description:
        "Nuvola, detergente viso delicato con glicerina, pantenolo e ceramide NP. Preordinalo senza pagamento online: ti ricontattiamo per confermare i tempi.",
    },
    price: "14.90",
    shippingNote: "Spedizione esclusa", // PLACEHOLDER: cost not confirmed
    delivery: "circa 2-3 settimane", // PLACEHOLDER
    highlights: [
      "Senza pagamento online",
      "Ti ricontattiamo per confermare",
      "Quantità limitata",
    ],
  },
];

export type Product = (typeof products)[number];
