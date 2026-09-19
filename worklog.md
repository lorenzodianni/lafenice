# Worklog: punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- `feat/newsletter`: form nel footer di tutte le pagine. Le pagine sono
  prerenderizzate, quindi il form deve fare POST a un path servito dal Worker
  (aggiungerlo a `assets.run_worker_first`), es. una route `/pages/newsletter` con
  action + esito. Riusare `sendPreorder`/`call` di `app/lib/preorder.ts` per il
  double opt-in (estrarre il client Brevo in `app/lib/brevo.ts` a quel punto).
  Serve anche una pagina "iscrizione confermata" come `redirectionUrl` del double
  opt-in (ora punta alla home).
- Poi: privacy policy (`/policies/privacy-policy`, già linkata da footer e form:
  404 finché non esiste), sitemap/robots/llms.txt.
- Prima di collegare Cloudflare (go-live): privacy deve esistere, i `PLACEHOLDER`
  vanno sostituiti (altrimenti Google indicizza dati finti) e Brevo configurato.

## Dati mancanti dal cliente (nel mockup sono placeholder)
- Ragione sociale, P.IVA, indirizzo, telefono, numero WhatsApp, orari, URL social,
  anno di apertura (badge "Dal 2014"). Tutti marcati `PLACEHOLDER` in `app/content/`.
- Dominio: `lafenice-estetica.it` è reale/registrato? Quali caselle esistono
  (info@, ordini@) e dove vanno inoltrate (Cloudflare Email Routing)?
- Prodotto: prezzo (`price` in `products.ts`; senza prezzo il JSON-LD `Offer` non è
  idoneo ai rich result), formato/ml, INCI, foto reali, tempi di consegna.
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
- Brevo: API key (secret `BREVO_API_KEY`), liste "Preordini" e "Newsletter" e
  template double opt-in (i tre ID vanno nei `vars` di `wrangler.jsonc`, ora 0),
  dominio mittente autenticato (DKIM/DMARC): l'email al negozio parte da
  `ordersEmail` di `site.ts`, che deve essere un mittente verificato.
- Google Business Profile (la leva principale per la SEO locale), Google Search
  Console, Bing Webmaster Tools (Bing alimenta ChatGPT search/Copilot).

## Da verificare appena c'è l'account Brevo
- `sendPreorder` crea il contatto e poi chiama `/contacts/doubleOptinConfirmation`
  sullo stesso indirizzo: che Brevo accetti il double opt-in per un contatto già
  esistente è un'ipotesi, testata solo con fetch finto. Primo test reale da fare;
  se lo rifiuta, invertire l'ordine o saltare la creazione quando c'è il consenso.

## Da valutare più avanti
- Cloudflare Turnstile se l'honeypot non basta contro lo spam.
- Pagina `/pages/trattamenti` dedicata (SEO locale) se i trattamenti crescono o
  arrivano i prezzi.
- Pipeline immagini (es. `vite-imagetools`) quando arrivano le foto reali.
- `og:image` (anteprima nei social/chat): serve una foto reale 1200x630, gli SVG
  placeholder non sono validi per Open Graph.
- Animazioni di comparsa allo scroll del mockup: tolte (erano JS). Se servono, solo
  CSS con `animation-timeline: view()`.
