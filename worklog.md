# Worklog: punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- `feat/product`: scheda `/products/detergente-viso-rinascita` + form preordine
  (action + Brevo). Il bottone "Preordina ora" della home punta già lì e dà 404
  finché la pagina non esiste. Con la seconda route: estrarre i meta comuni
  (title, description, canonical, og) in `app/lib/seo.ts` e aggiungere a
  `products.ts` un campo esplicito per la parola in corsivo del titolo (ora è
  l'ultima parola, ricavata nel componente).
- Poi: newsletter nel footer, privacy policy (`/policies/privacy-policy`, già
  linkata dal footer: 404 finché non esiste), sitemap/robots/llms.txt.
- Prima di collegare Cloudflare (go-live): scheda prodotto e privacy devono esistere
  e i `PLACEHOLDER` vanno sostituiti, altrimenti Google indicizza dati finti.

## Dati mancanti dal cliente (nel mockup sono placeholder)
- Ragione sociale, P.IVA, indirizzo, telefono, numero WhatsApp, orari, URL social,
  anno di apertura (badge "Dal 2014"). Tutti marcati `PLACEHOLDER` in `app/content/`.
- Dominio: `lafenice-estetica.it` è reale/registrato? Quali caselle esistono
  (info@, ordini@) e dove vanno inoltrate (Cloudflare Email Routing)?
- Prodotto: prezzo (senza prezzo niente rich result Product con `offers`), formato/ml,
  INCI, foto reali, tempi di consegna.
- Foto reali del centro (hero, studio). Ora in `app/assets/` ci sono i placeholder
  SVG del mockup.
- Logo vettoriale (SVG) o PNG ad alta risoluzione. Ora: `app/assets/logo.webp`
  (71x92, 2x della dimensione mostrata) e `public/favicon.png`, entrambi ricavati
  dal PNG 220x284 incluso in `docs/mockup.html`.
- Testo privacy policy: da far validare a un consulente.

## Account da creare (a carico del cliente)
- Cloudflare: dominio + DNS, Workers, Web Analytics. Workers Builds collegato al
  repo: build `npm run build`, deploy `npx wrangler deploy` (legge la config generata
  in `build/server/wrangler.json` tramite `.wrangler/deploy/config.json`).
- Brevo: API key, liste "Preordini" e "Newsletter", template double opt-in, dominio
  mittente autenticato (DKIM/DMARC).
- Google Business Profile (la leva principale per la SEO locale), Google Search
  Console, Bing Webmaster Tools (Bing alimenta ChatGPT search/Copilot).

## Da valutare più avanti
- Cloudflare Turnstile se l'honeypot non basta contro lo spam.
- Pagina `/pages/trattamenti` dedicata (SEO locale) se i trattamenti crescono o
  arrivano i prezzi.
- Pipeline immagini (es. `vite-imagetools`) quando arrivano le foto reali.
- `og:image` (anteprima nei social/chat): serve una foto reale 1200x630, gli SVG
  placeholder non sono validi per Open Graph.
- Animazioni di comparsa allo scroll del mockup: tolte (erano JS). Se servono, solo
  CSS con `animation-timeline: view()`.
