# Worklog — punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- Scaffolding React Router 7.16 + Cloudflare Workers, poi aggiungere a CLAUDE.md la
  sezione "Comandi" (dev, build, test, deploy).
- Estrarre dal mockup le 4 immagini base64 (2 PNG, 2 SVG: logo e placeholder) in
  `app/assets/`.

## Dati mancanti dal cliente (nel mockup sono placeholder)
- Ragione sociale, P.IVA, indirizzo, telefono/WhatsApp, orari, URL social.
- Dominio: `lafenice-estetica.it` è reale/registrato? Quali caselle esistono
  (info@, ordini@) e dove vanno inoltrate (Cloudflare Email Routing)?
- Prodotto: prezzo (senza prezzo niente rich result Product con `offers`), formato/ml,
  INCI, foto reali, tempi di consegna.
- Foto reali del centro (hero, studio).
- Testo privacy policy: da far validare a un consulente.

## Account da creare (a carico del cliente)
- Cloudflare: dominio + DNS, Workers, Web Analytics.
- Brevo: API key, liste "Preordini" e "Newsletter", template double opt-in, dominio
  mittente autenticato (DKIM/DMARC).
- Google Business Profile (la leva principale per la SEO locale), Google Search
  Console, Bing Webmaster Tools (Bing alimenta ChatGPT search/Copilot).

## Da valutare più avanti
- Cloudflare Turnstile se l'honeypot non basta contro lo spam.
- Pagina `/pages/trattamenti` dedicata (SEO locale) se i trattamenti crescono o
  arrivano i prezzi.
- Pipeline immagini (es. `vite-imagetools`) quando arrivano le foto reali.
