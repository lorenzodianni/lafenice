# Worklog: punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- Prima di collegare Cloudflare (go-live): il testo della privacy va validato da
  un consulente, i `PLACEHOLDER` vanno sostituiti (altrimenti Google indicizza
  dati finti) e Brevo configurato.
  Serve anche una regola di rate limiting Cloudflare (WAF, da dashboard) sulle POST
  a `/pages/newsletter` e `/products/*`: con il solo honeypot uno script può far
  partire email di double opt-in verso indirizzi altrui, consumando la quota Brevo
  che serve anche alle notifiche dei preordini.

## Dati mancanti dal cliente (nel mockup sono placeholder)
- Ragione sociale, orari, URL social, anno di apertura (badge "Dal 2014": l'email
  `c.elafenice2020@` fa pensare al 2020). Marcati `PLACEHOLDER` in `app/content/`.
- WhatsApp: 371 457 1906 è un mobile, va abilitato come WhatsApp (`site.whatsapp`)?
- Dominio: `lafenice-estetica.it` è reale/registrato? Oggi email e ordini vanno alla
  casella Gmail: come mittente Brevo non è autenticabile (niente DKIM su gmail.com),
  quindi le notifiche dei preordini rischiano lo spam. Con un dominio proprio si
  risolve (Cloudflare Email Routing + mittente autenticato).
  Prima del go-live serve un preordine di prova con la chiave vera: se Brevo
  rifiuta un mittente su dominio gratuito, `sendPreorder` lancia e il form
  risponde 502, cioè il preordine non si può inviare affatto.
- Prodotto: costo di spedizione (ora "Spedizione esclusa" senza importo),
  formato/ml, INCI, foto reali, tempi di consegna.
- Foto reali del centro (hero: 3 slide) e dei trattamenti (8 card). Ora sono
  placeholder SVG in `app/assets/`.
- Logo vettoriale (SVG) o PNG ad alta risoluzione. Ora: `app/assets/logo.webp`
  (71x92, 2x della dimensione mostrata) e `public/favicon.png`, entrambi ricavati
  dal PNG 220x284 incluso in `docs/mockup.html`.

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
- Stessa chiamata dal form newsletter con un indirizzo già iscritto: se Brevo
  risponde con un errore, l'utente vede "non siamo riusciti a completare
  l'iscrizione" (502). In quel caso trattare quel codice di errore come successo.

## Da valutare più avanti
- Cloudflare Turnstile se honeypot e rate limiting non bastano contro lo spam.
- Pagina `/pages/trattamenti` dedicata (SEO locale) se i trattamenti crescono o
  arrivano i prezzi.
- Pipeline immagini (es. `vite-imagetools`) quando arrivano le foto reali.
- `og:image` (anteprima nei social/chat): serve una foto reale 1200x630, gli SVG
  placeholder non sono validi per Open Graph.
- Animazioni di comparsa allo scroll del mockup: tolte (erano JS). Se servono, solo
  CSS con `animation-timeline: view()`.
