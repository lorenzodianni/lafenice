# La Fenice: sito vetrina

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
  `ssr: true` + `prerender: true`: ogni path statico è HTML generato a build. Mai
  `ssr: false` (SPA mode): le action non girerebbero e i form senza JS morirebbero.
  Deploy da integrazione Git di Cloudflare, niente CI custom.
- **Path che ricevono un form = serviti dal Worker.** Gli asset statici
  rispondono a ogni metodo: una POST su una pagina prerenderizzata riceve un 405
  vuoto e non arriva mai all'action. Ogni path che riceve una POST va in
  `assets.run_worker_first` di `wrangler.jsonc` (oggi `/products/*` e
  `/pages/newsletter`). Un path statico lì dentro viene comunque prerenderizzato,
  ma quell'HTML non viene mai servito: risponde il Worker.
  `html_handling: drop-trailing-slash`: URL senza slash finale, come Shopify.
- `cloudflare:workers` (env, secret) si importa solo con `await import()` dentro le
  action: il prerender gira in Node e un import statico rompe la build.
- **Niente React sul client di default**: `root.tsx` include `<Scripts/>` solo se
  una route esporta `handle = { hydrate: true }` (in dev sempre, per l'HMR). Le
  pagine sono HTML + CSS; l'unico JS è lo script inline che chiude il menu mobile.
  Una route idrata solo se le serve davvero (es. stato di invio di un form).
- **Brevo** (API REST v3 via `fetch`, niente SDK) è l'unico "database":
  contatti, liste, double opt-in, email transazionali. Nessun DB nostro.
- **SCSS** (`sass-embedded`, compilato da Vite): colori e font come CSS custom
  properties del mockup in `app/styles/global.scss`; breakpoint e mixin in
  `app/styles/_mixins.scss`; SCSS Modules per componente (`*.module.scss`). Solo
  `@use`/`@forward`, mai `@import` (deprecato in Dart Sass). Mobile first: base =
  mobile, `@include up(sm|md)` per salire. Niente Tailwind/UI kit.
  `global.scss` è tutto dentro `@layer base` (token, reset e le sole classi globali:
  `wrap`, `section`, `eyebrow`, `btn`, `btn-ghost`), così le regole dei moduli
  vincono sempre senza `!important` né giochi di specificità. Le varianti passano
  da custom properties (`--gutter`, `--eyebrow-color`), non da override delle classi.
  Nei moduli evita selettori di elemento generici (`p`, `a`) che colpiscono anche le
  classi globali: nel cascade vincono sempre loro.
- Font self-hosted: `@fontsource-variable/fraunces/opsz.css` (+ `opsz-italic.css`,
  il mockup usa l'asse `opsz`) e `@fontsource-variable/mulish`. Mai Google Fonts da
  CDN (GDPR + performance).
- npm, Biome (lint + format), Vitest solo per logica non banale (validazione, action).

## Comandi
- `npm run dev`: sviluppo (Worker locale via `@cloudflare/vite-plugin`)
- `npm run build` / `npm run preview`: build di produzione e anteprima nel runtime Worker
- `npm run typecheck` / `npm run lint` / `npm test` / `npm run build`: da far passare
  prima di ogni PR (`npm run format` sistema la formattazione). Vitest ha una config
  sua (`vitest.config.ts`): il plugin Cloudflare in `vite.config.ts` avvierebbe workerd.
- `npm run deploy`: deploy manuale; la produzione parte dall'integrazione Git di Cloudflare
- Dopo modifiche a `wrangler.jsonc`: `npm run cf-typegen` (tipi `Env`)
- Secret Brevo: `npx wrangler secret put BREVO_API_KEY`; in locale `BREVO_API_KEY=...`
  in `.dev.vars` (gitignored). In dev senza chiave le chiamate Brevo vengono solo loggate.

## Struttura
```
app/
  content/     site.ts (nome, indirizzo, orari, contatti, social, dati legali), products.ts
  components/  layout (Header, Footer) e sezioni + *.module.scss
  routes/      pagine + resource route (sitemap.xml, robots.txt, llms.txt)
  lib/         seo.ts (meta comuni), brevo.ts (client API + double opt-in),
               preorder.ts, newsletter.ts (validazione) + test
  styles/      global.scss, _mixins.scss
  assets/      immagini importate dai componenti
public/images/ immagini con URL stabile (servono al JSON-LD)
workers/app.ts entry del Worker (non toccare salvo bindings)
```
- Tutti i dati di business stanno in `app/content/`: UI, JSON-LD, sitemap e llms.txt
  leggono da lì. Mai duplicare indirizzo, orari, telefono. I valori non ancora
  confermati dal cliente sono marcati `PLACEHOLDER`: `grep -rn PLACEHOLDER app`.
- `products.ts` usa i nomi dei campi Shopify (`handle`, `title`, `description`,
  `seo`, `featuredImage`, …): in migrazione cambia solo il loader (Storefront API).

## URL (convenzioni Shopify → zero redirect in migrazione)
- `/` home: hero, teaser prodotto (CTA verso la scheda), trattamenti, studio, contatti
- `/products/detergente-viso-rinascita` scheda prodotto + **unico** form preordine
- `/pages/grazie-preordine` destinazione dopo l'invio (redirect, `noindex`)
- `/pages/newsletter` riceve tutti i form newsletter e ne mostra gli errori;
  `/pages/grazie-newsletter` dopo l'invio, `/pages/iscrizione-confermata` dopo il
  click nell'email del double opt-in (entrambe `noindex`)
- `/policies/privacy-policy`
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` generati da `app/content/`

## Form
- **Preordine**: nome*, email*, telefono, quantità, note, presa visione privacy*,
  consenso marketing opzionale. Action → contatto Brevo in lista "Preordini" (+
  double opt-in "Newsletter" se c'è il consenso) + email a `ordersEmail` con
  reply-to del cliente, poi redirect a `/pages/grazie-preordine`. Se Brevo fallisce
  la pagina torna con un errore e i campi compilati: mai finto successo.
- **Newsletter**: nel footer di ogni pagina, email* + consenso* → double opt-in
  Brevo, lista "Newsletter". POST a `/pages/newsletter` (le pagine sono statiche),
  stesso schema del preordine: errori sulla pagina, redirect a
  `/pages/grazie-newsletter`.
- `<Form>` di React Router: deve funzionare anche senza JS.
- Validazione sempre lato server, honeypot anti-spam. Segreti solo come secret del
  Worker (`BREVO_API_KEY`), mai nel bundle client.
- `mailto:` solo come contatto alternativo, mai come canale del form.
- "Prenota" (trattamenti) porta alla sezione contatti (`/#contatti`); lì il bottone è
  `tel:` e c'è WhatsApp. Nessun sistema di prenotazione.

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
  `fetchpriority="high"`, preload dei font above the fold (`links` in `root.tsx`).

## Workflow
- Testi del sito in italiano; codice, identificatori e commit in inglese.
- **Mai usare l'em dash (U+2014)**: né nei testi del sito, né in codice, commenti, commit,
  PR o documentazione. Usa due punti, virgola, punto o trattino semplice. Vale anche
  per il copy preso dal mockup, che ne contiene.
- Ogni feature: nuovo branch da `main` (`feat/…`, `fix/…`, `docs/…`) → PR con `gh` →
  merge su `main` con merge commit (`gh pr merge --merge --delete-branch`). Mai
  squash: i singoli commit con il loro perché sono il worklog.
- Conventional Commits. Nel body sempre il **perché** delle scelte: git è il log
  delle decisioni prese.
- `worklog.md`: solo decisioni aperte e lavori a metà tra una sessione e l'altra.
  Quando un punto si chiude, il perché va nel commit e il punto si toglie dal worklog.
