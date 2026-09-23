# Worklog: punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- La checklist per il go-live (dominio, Cloudflare, Brevo, mittente email, rate
  limiting, dati del cliente) sta in `docs/rollout.md`, con il perché di ogni
  scelta. Qui restano solo i punti ancora da decidere.
- Due PR aperte, una sopra l'altra: #19 (dominio, pagina "in arrivo" già
  online) e #20 (Brevo reale, niente doppia conferma, tetto orario) con base
  `feat/custom-domain`. Prima del merge `/simplify` e `/code-review` su
  ciascuna; si mergia #19, poi #20 (GitHub la sposta su `main`).
- Dalla dashboard, `docs/rollout.md` §3 "Da fare": chiave API Brevo `sito`,
  subito in `.dev.vars` con `! printf 'BREVO_API_KEY=%s\n' "$(pbpaste)" >
  .dev.vars` (la chiave non passa in chat) e come Secret `BREVO_API_KEY` del
  Worker `lafenice`; IP autorizzati spenti in Brevo, Sicurezza.
- Poi i test reali del §4 in locale (`npm run preview` con la chiave vera) e
  la regola Cloudflare per IP del §7.
- Il go-live (§2, "Go-live") aspetta testi, foto e dati della cliente (§5-6).

## Dati mancanti dal cliente
- La lista completa, con il perché di ogni domanda, sta in
  `docs/domande-cliente.md`. In breve: foto dei trattamenti e del prodotto,
  dati del prodotto (formato, INCI), social e WhatsApp.
- Bloccano la vendita spedita, che è vendita a distanza: prezzo finale e regime
  IVA, costo e corriere, se spedisce solo in Italia, mezzi di pagamento oltre al
  bonifico, chi paga il reso. L'INCI serve prima dell'acquisto, non solo sulla
  confezione.
- Marcati `PLACEHOLDER` in `app/content/` e nelle pagine che citano quei dati
  (`app/routes/terms.tsx`, `app/components/PreorderForm.tsx`):
  `grep -rn PLACEHOLDER app`.

## Da valutare più avanti
- Immagini: le foto dello studio sono WebP fatti a mano con cwebp e dichiarati
  in `Hero.tsx`. Quando arrivano le foto dei trattamenti e del prodotto, o
  quelle professionali, decidere insieme per tutte: dati in `app/content/` con i
  nomi dei campi Shopify (come `featuredImage`) e come generare i srcset (a
  mano o con una pipeline).
- Pagina `/pages/trattamenti` dedicata (SEO locale) se i trattamenti crescono o
  arrivano i prezzi.
- Slider hero: manca un comando di pausa visibile per l'autoplay (WCAG
  2.2.2, contenuto che si muove per più di 5 secondi). Oggi si ferma al
  primo click, tap o focus sui controlli, si mette in pausa quando si
  scorrono le foto e non parte con `prefers-reduced-motion`. Da decidere:
  un bottone pausa/play accanto ai pallini, oppure niente autoplay.
- Animazioni di comparsa allo scroll del mockup: tolte (erano JS). Se servono, solo
  CSS con `animation-timeline: view()`.
