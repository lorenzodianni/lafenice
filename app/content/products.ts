// Field names follow the Shopify Storefront API Product, so migrating to
// Hydrogen only swaps this file for a Storefront query. Fields that Shopify
// does not have (titleAccent, tagline, delivery, highlights) would become
// metafields. Images live in public/: JSON-LD needs URLs that do not change
// with every build.
export const products = [
  {
    handle: "detergente-viso-rinascita",
    title: "Detergente viso Rinascita",
    titleAccent: "Rinascita", // word set in italic, as in the mockup
    tagline: "Il primo prodotto della linea skincare",
    description:
      "Il primo gesto del rituale La Fenice: un detergente viso delicato, pensato per rinnovare la pelle ogni giorno. Disponibile in preordine, nessun pagamento ora: ti ricontattiamo noi per confermare disponibilità e tempi.",
    featuredImage: {
      url: "/images/detergente-viso-rinascita.svg", // PLACEHOLDER: real photo pending
      altText: "Detergente viso Rinascita",
      width: 800,
      height: 1000,
    },
    seo: {
      title: "Detergente viso Rinascita in preordine",
      description:
        "Detergente viso delicato della linea skincare La Fenice. Preordinalo senza pagamento online: ti ricontattiamo per confermare disponibilità e tempi.",
    },
    price: null as string | null, // PLACEHOLDER: EUR amount, e.g. "24.90"
    delivery: "circa 2-3 settimane", // PLACEHOLDER
    highlights: [
      "Senza pagamento online",
      "Ti ricontattiamo per confermare",
      "Quantità limitata",
    ],
  },
];

export type Product = (typeof products)[number];
