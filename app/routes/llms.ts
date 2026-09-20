import { products } from "~/content/products";
import {
  closedDays,
  fullAddress,
  openingHours,
  site,
  treatments,
} from "~/content/site";

const product = products[0];
const price = `${product.price.replace(".", ",")} euro`;
const hours = openingHours.map((h) => `${h.days} ${h.time}`).join(", ");

// llms.txt: the whole site as plain markdown, so an assistant answering about
// the centre reads the same facts as the pages, from app/content/.
export function loader() {
  const body = `# ${site.name}

> ${site.description}

- Titolare: ${site.owner.name}, ${site.owner.role.toLowerCase()}
- Indirizzo: ${fullAddress}
- Telefono: ${site.phone}
- Email: ${site.email}
- Orari: ${hours}${closedDays.length > 0 ? `. Chiuso: ${closedDays.join(", ")}` : ""}
- Sito: ${site.url}

## Prodotto

[${product.title}](${site.url}/products/${product.handle}): ${product.description.split("\n\n")[0]} Prezzo ${price}, ${product.shippingNote.toLowerCase()}. Si preordina dal sito senza alcun pagamento online: il centro ricontatta chi ordina per confermare disponibilità e tempi di consegna (${product.delivery}).

## Trattamenti

${treatments.map((t) => `- ${t.name}: ${t.description.split("\n\n")[0]}`).join("\n")}

I trattamenti non si prenotano online: si fissano per telefono o in negozio.

## Pagine

- [Home](${site.url}/): centro, prodotto, trattamenti, contatti
- [${product.title}](${site.url}/products/${product.handle}): scheda e modulo di preordine
- [Newsletter](${site.url}/pages/newsletter): iscrizione a novità e promozioni
- [Informativa privacy](${site.url}/policies/privacy-policy)
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
