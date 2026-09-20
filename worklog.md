# Worklog: punti aperti

Solo cose non ancora decise o a metà. Chiuso un punto: il perché va nel commit e il
punto si toglie da qui.

## Prossimo passo
- La checklist per il go-live (dominio, Cloudflare, Brevo, mittente email, rate
  limiting, dati del cliente) sta in `docs/rollout.md`, con il perché di ogni
  scelta. Qui restano solo i punti ancora da decidere.

## Dati mancanti dal cliente
- La lista completa, con il perché di ogni domanda, sta in
  `docs/domande-cliente.md`. In breve: nome del dominio, foto e logo, dati del
  prodotto (formato, INCI), social e WhatsApp.
- Bloccano la vendita spedita, che è vendita a distanza: prezzo finale e regime
  IVA, costo e corriere, se spedisce solo in Italia, mezzi di pagamento oltre al
  bonifico, chi paga il reso. L'INCI serve prima dell'acquisto, non solo sulla
  confezione.
- Marcati `PLACEHOLDER` in `app/content/` e nelle pagine che citano quei dati
  (`app/routes/terms.tsx`, `app/components/PreorderForm.tsx`):
  `grep -rn PLACEHOLDER app`.

## Da valutare più avanti
- Pagina `/pages/trattamenti` dedicata (SEO locale) se i trattamenti crescono o
  arrivano i prezzi.
- Pipeline immagini (es. `vite-imagetools`) quando arrivano le foto reali.
- Animazioni di comparsa allo scroll del mockup: tolte (erano JS). Se servono, solo
  CSS con `animation-timeline: view()`.
