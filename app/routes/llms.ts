import { euro, products } from "~/content/products";
import {
  closedDays,
  fullAddress,
  openingHours,
  site,
  treatments,
} from "~/content/site";

// llms.txt: the whole site as plain markdown, so an assistant answering about
// the centre reads the same facts as the pages, from app/content/. The page
// list at the bottom mirrors the one in sitemap.ts.
export function loader() {
  const product = products[0];
  const hours = openingHours.map((h) => `${h.days} ${h.time}`).join(", ");
  const productUrl = `${site.url}/products/${product.handle}`;
  // First paragraph only: the rest is copy for the page, not facts.
  const summary = (text: string) => text.split("\n\n")[0];

  const body = `# ${site.name}

> ${site.description}

- ${site.owner.role}: ${site.owner.name}
- Indirizzo: ${fullAddress}
- Telefono: ${site.phone}
- Email: ${site.email}
- Orari: ${hours}${closedDays.length > 0 ? `. Chiuso: ${closedDays.join(", ")}` : ""}
- Sito: ${site.url}

## Prodotto

[${product.title}](${productUrl}): ${summary(product.description)}

- Prezzo: ${euro.format(Number(product.price))}, ${product.shippingNote.toLowerCase()}
- Preordine: dal sito, senza alcun pagamento online. Il centro ricontatta chi ordina per confermare disponibilità e tempi.
- Consegna: ${product.delivery}

## Trattamenti

${treatments.map((t) => `- ${t.name}: ${summary(t.description)}`).join("\n")}

I trattamenti non si prenotano online: si fissano per telefono o in negozio.

## Pagine

- [Home](${site.url}/): centro, prodotto, trattamenti, contatti
- [${product.title}](${productUrl}): scheda e modulo di preordine
- [Newsletter](${site.url}/pages/newsletter): iscrizione a novità e promozioni
- [Informativa privacy](${site.url}/policies/privacy-policy)
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
