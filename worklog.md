# Worklog: punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- Feature home page (`feat/home`): sezioni dal mockup, `app/content/site.ts`, JSON-LD
  `BeautySalon`.
- Poi: scheda prodotto + form preordine, newsletter, privacy, sitemap/robots/llms.txt.

## Dati mancanti dal cliente (nel mockup sono placeholder)
- Ragione sociale, P.IVA, indirizzo, telefono/WhatsApp, orari, URL social.
- Dominio: `lafenice-estetica.it` è reale/registrato? Quali caselle esistono
  (info@, ordini@) e dove vanno inoltrate (Cloudflare Email Routing)?
- Prodotto: prezzo (senza prezzo niente rich result Product con `offers`), formato/ml,
  INCI, foto reali, tempi di consegna.
- Foto reali del centro (hero, studio). Ora in `app/assets/` ci sono i placeholder
  SVG del mockup.
- Logo vettoriale (SVG) o PNG ad alta risoluzione: quello del mockup è 220x284 px
  (`app/assets/logo.png`, da cui è ricavata `public/favicon.png`).
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
