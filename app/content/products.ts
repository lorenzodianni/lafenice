import placeholderProduct from "~/assets/placeholder-product.svg";

// Field names follow the Shopify Storefront API Product, so migrating to
// Hydrogen only swaps this file for a Storefront query. Fields that Shopify
// does not have (tagline, delivery, highlights) would become metafields.
export const products = [
  {
    handle: "detergente-viso-rinascita",
    title: "Detergente viso Rinascita",
    tagline: "Il primo prodotto della linea skincare",
    description:
      "Il primo gesto del rituale La Fenice: un detergente viso delicato, pensato per rinnovare la pelle ogni giorno. Disponibile in preordine, nessun pagamento ora: ti ricontattiamo noi per confermare disponibilità e tempi.",
    featuredImage: {
      url: placeholderProduct, // PLACEHOLDER: real photo pending
      altText: "Detergente viso Rinascita",
      width: 800,
      height: 1000,
    },
    seo: {
      title: "Detergente viso Rinascita in preordine",
      description:
        "Detergente viso delicato della linea skincare La Fenice. Preordinalo senza pagamento online: ti ricontattiamo per confermare disponibilità e tempi.",
    },
    delivery: "circa 2-3 settimane", // PLACEHOLDER
    highlights: [
      "Senza pagamento online",
      "Ti ricontattiamo per confermare",
      "Quantità limitata",
    ],
  },
];

export type Product = (typeof products)[number];
