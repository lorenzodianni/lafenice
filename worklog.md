# Worklog: punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- La checklist per il go-live (dominio, Cloudflare, Brevo, mittente email, rate
  limiting, dati del cliente) sta in `docs/rollout.md`, con il perché di ogni
  scelta. Qui restano solo i punti ancora da decidere.

## Dati mancanti dal cliente (nel mockup sono placeholder)
- Ragione sociale, orari, URL social, anno di apertura (badge "Dal 2014": l'email
  `c.elafenice2020@` fa pensare al 2020). Marcati `PLACEHOLDER` in `app/content/`.
- WhatsApp: 371 457 1906 è un mobile, va abilitato come WhatsApp (`site.whatsapp`)?
- Dominio: `lafenice-estetica.it` è reale/registrato? Il cliente lo vuole? Senza,
  i preordini non si possono nemmeno inviare (`docs/rollout.md`, punto 3).
- Prodotto: costo di spedizione (ora "Spedizione esclusa" senza importo),
  formato/ml, INCI, foto reali, tempi di consegna.
- Foto reali del centro (hero: 3 slide) e dei trattamenti (8 card). Ora sono
  placeholder SVG in `app/assets/`.
- Logo vettoriale (SVG) o PNG ad alta risoluzione. Ora: `app/assets/logo.webp`
  (71x92, 2x della dimensione mostrata) e `public/favicon.png`, entrambi ricavati
  dal PNG 220x284 incluso in `docs/mockup.html`.

## Da valutare più avanti
- Pagina `/pages/trattamenti` dedicata (SEO locale) se i trattamenti crescono o
  arrivano i prezzi.
- Pipeline immagini (es. `vite-imagetools`) quando arrivano le foto reali.
- Animazioni di comparsa allo scroll del mockup: tolte (erano JS). Se servono, solo
  CSS con `animation-timeline: view()`.
