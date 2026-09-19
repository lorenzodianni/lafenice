# La Fenice — sito vetrina

Sito del Centro Estetico La Fenice (Novara, titolare Micaela Brunetti). Obiettivi:
mostrare il centro e il primo prodotto (Detergente viso Rinascita), raccogliere
**preordini** (nessun pagamento online) e **iscrizioni newsletter/promo**.
Solo italiano, mobile first, ottimizzato per SEO e motori AI. Possibile migrazione
futura a **Shopify Hydrogen**: ogni scelta deve facilitarla.

Riferimento visivo: `docs/mockup.html` (palette, font, copy, sezioni). Il mockup è
desktop-first con dati placeholder: il sito no.

## Stack
- **React Router 7.16.x** (framework mode) + TypeScript strict. È la versione
  pinnata da `@shopify/hydrogen`: route, loader, action e componenti si portano in
  Hydrogen così come sono. Niente RR 8 finché Hydrogen non lo supporta
  (`npm view @shopify/hydrogen peerDependencies`).
- **Cloudflare Workers** (runtime workerd, lo stesso di Oxygen). Config:
  `ssr: true` + `prerender: [...]` con tutte le pagine: HTML statico a build e
  l'unico codice server sono le `action` dei form. Mai `ssr: false` (SPA mode):
  le action non arriverebbero al Worker e i form senza JS smetterebbero di funzionare.
  Deploy da integrazione Git di Cloudflare, niente CI custom.
- **Brevo** (API REST v3 via `fetch`, niente SDK) è l'unico "database":
  contatti, liste, double opt-in, email transazionali. Nessun DB nostro.
- **CSS puro**: token (custom properties del mockup) in `app/styles/global.css`,
  CSS Modules per componente. Mobile first: base = mobile, `@media (min-width)`
  per salire. Niente Tailwind/UI kit.
- Font self-hosted: `@fontsource-variable/fraunces/opsz.css` (+ `opsz-italic.css`,
  il mockup usa l'asse `opsz`) e `@fontsource-variable/mulish`. Mai Google Fonts da
  CDN (GDPR + performance).
- npm, Biome (lint + format), Vitest solo per logica non banale (validazione, action).

## Struttura
```
app/
  content/     site.ts (nome, indirizzo, orari, contatti, social, dati legali), products.ts
  components/  UI riusabile + *.module.css
  routes/      pagine + resource route (sitemap.xml, robots.txt, llms.txt)
  lib/         client Brevo, validazione form, helper SEO/JSON-LD
  styles/      global.css
```
- Tutti i dati di business stanno in `app/content/`: UI, JSON-LD, sitemap e llms.txt
  leggono da lì. Mai duplicare indirizzo, orari, telefono.
- `products.ts` usa i nomi dei campi Shopify (`handle`, `title`, `description`,
  `seo`, `featuredImage`, …): in migrazione cambia solo il loader (Storefront API).

## URL (convenzioni Shopify → zero redirect in migrazione)
- `/` home: hero, teaser prodotto (CTA verso la scheda), trattamenti, studio, contatti
- `/products/detergente-viso-rinascita` scheda prodotto + **unico** form preordine
- `/policies/privacy-policy`
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` generati da `app/content/`
- Form newsletter nel footer di tutte le pagine.

## Form
- **Preordine**: nome*, email*, telefono, quantità, note, checkbox marketing
  opzionale. Action → contatto Brevo in lista "Preordini" (+ "Newsletter" via double
  opt-in se ha spuntato il consenso) + email al negozio con i dettagli.
- **Newsletter**: email + consenso → double opt-in Brevo, lista "Newsletter".
- `<Form>` di React Router: deve funzionare anche senza JS.
- Validazione sempre lato server, honeypot anti-spam. Segreti solo come secret del
  Worker (`BREVO_API_KEY`), mai nel bundle client.
- `mailto:` solo come contatto alternativo, mai come canale del form.
- "Prenota" (trattamenti) = link `tel:` / WhatsApp: nessun sistema di prenotazione.

## GDPR / legale
- Consenso marketing separato, esplicito, mai preselezionato; la prova del consenso
  è il double opt-in di Brevo.
- **Nessun cookie non tecnico → nessun cookie banner.** Quindi niente Google Analytics
  né embed Google Maps (immagine statica + link a Maps); analytics = Cloudflare Web
  Analytics (cookieless). Ogni nuovo script di terze parti va valutato contro questa regola.
- Footer: ragione sociale, sede, P.IVA, link privacy.

## SEO / AI
- `<html lang="it">`, un solo `h1` per pagina, HTML semantico.
- Ogni route esporta `meta`: title, description, canonical, Open Graph
  (`og:locale=it_IT`).
- JSON-LD: `BeautySalon` in home (da `site.ts`); `Product` con
  `offers.availability=PreOrder` + `BreadcrumbList` sulla scheda prodotto.
- `robots.txt` ammette anche i crawler AI (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended). `llms.txt` riassume centro, prodotto, contatti.
- Core Web Vitals: immagini AVIF/WebP con `width`/`height` e `srcset`, hero con
  `fetchpriority="high"`, JS client minimo.

## Workflow
- Testi del sito in italiano; codice, identificatori e commit in inglese.
- Conventional Commits. Nel body sempre il **perché** delle scelte: git è il log
  delle decisioni prese.
- `worklog.md`: solo decisioni aperte e lavori a metà tra una sessione e l'altra.
  Quando un punto si chiude, il perché va nel commit e il punto si toglie dal worklog.
