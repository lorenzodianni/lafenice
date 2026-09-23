# Rollout: cosa fare prima di pubblicare

Ordine consigliato: ogni punto sblocca i successivi. Qui sta anche il perché di
ogni scelta, così non si ridiscute a distanza di mesi. I dubbi ancora aperti
restano in `worklog.md`.

## 1. Cloudflare (blocca tutto il resto)

Account a carico del cliente, con un metodo di pagamento per il dominio.
Serve per: dominio, DNS, hosting del Worker, Email Routing e Web Analytics
(senza cookie, quindi nessun banner).

Workers Builds collegato al repo: build `npm run build`, deploy
`npx wrangler deploy` (legge la config generata in `build/server/wrangler.json`
tramite `.wrangler/deploy/config.json`). Il Worker in dashboard si deve
chiamare `lafenice`, come `name` in `wrangler.jsonc`, o la build fallisce.

Il repo si collega solo al go-live (punto 2): collegarlo fa partire subito un
deploy, e il sito vero va online sul dominio (`routes` in `wrangler.jsonc`).
Fino ad allora la cliente vede il sito nell'anteprima su GitHub Pages, e i form
si provano in locale con `npm run preview` e la chiave Brevo vera in
`.dev.vars`: in produzione senza chiave le chiamate falliscono, il salto esiste
solo in dev.

## 2. Dominio

`lafenicecentroestetico.com`, comprato il 23 settembre 2026 da Cloudflare
Registrar, dall'account del punto 1, intestato alla titolare come persona
(ditta individuale: campo Organization vuoto). Cloudflare lo vende a prezzo di
costo anche al rinnovo (circa 10 dollari l'anno). Rispetto a un registrar
esterno è un account in meno, e il DNS è già su Cloudflare: niente nameserver
da spostare.

Già fatto nel codice: `site.url` (base di canonical, Open Graph, JSON-LD,
sitemap e llms.txt) punta a `https://www.lafenicecentroestetico.com`, e
`routes` in `wrangler.jsonc` aggancia al Worker `www` e il dominio nudo. Il
deploy crea da solo record DNS e certificati.

Email Address Obfuscation è spenta (Security, Settings). È attiva di default:
riscrive gli indirizzi email nell'HTML e li ricostruisce con uno script, quindi
senza JS, e per i crawler che non lo eseguono, l'email del centro sparisce.

Verifica dell'intestataria (ICANN): non è arrivata nessuna email, solo la
conferma d'acquisto, perché l'intestataria ha la stessa email già verificata
dell'account. Registrations mostra il dominio Active senza avvisi e il
registro `.com` (RDAP) non ha `clientHold`. Se un giorno il sito smette di
rispondere, è il primo posto da guardare.

### Fino al go-live: pagina "in arrivo"

Il sito vero non va online finché testi, foto e dati non sono definitivi
(punti 5 e 6). Sul dominio intanto risponde il Worker `lafenice` con lo script
di `docs/coming-soon.js`, incollato a mano nell'editor della dashboard: una
pagina sola con indirizzo, telefono, orari e P.IVA (va sul sito di
un'impresa). È `noindex`, così Google non si tiene "sito in arrivo" come
descrizione anche dopo il lancio. Il Worker è lo stesso che al go-live riceve il
sito vero: i domini restano agganciati e non c'è niente da staccare.

1. Compute, Workers & Pages, Create, Start with Hello World: nome **`lafenice`**
   (il `name` di `wrangler.jsonc`), Deploy. Poi Edit code, incollare
   `docs/coming-soon.js` al posto del codice di esempio, Deploy.
2. Settings, Domains & Routes, Add, Custom domain: `www.lafenicecentroestetico.com`
   e `lafenicecentroestetico.com`.
3. **Redirect 301 dal dominio nudo a `www`**: Rules, Redirect Rules, template
   "Redirect from root to WWW", con "Preserve query string". Senza, il dominio
   nudo serve una seconda copia del sito.
4. **Always Use HTTPS** (SSL/TLS, Edge Certificates): è spento di default, e
   senza le visite in `http://` ricevono la pagina in chiaro.

Fatto il 23 settembre 2026 e verificato con curl: `http://` e il dominio nudo
arrivano a `https://www.` mantenendo percorso e query string.

### Go-live

1. Punti 3-6 chiusi.
2. Worker `lafenice`, Settings, Build: collegare il repo (build
   `npm run build`, deploy `npx wrangler deploy`). Il primo build sostituisce la
   pagina con il sito vero. Se un Worker creato dall'editor non si può
   collegare, cancellarlo e ricrearlo da Import a repository con lo stesso
   nome: i domini li riaggancia `routes`, il secret `BREVO_API_KEY` va rimesso.
3. Sul dominio vero: home, scheda prodotto, un preordine e un'iscrizione
   newsletter.
4. Cancellare `docs/coming-soon.js` e questa sezione, poi punto 8.

## 3. Brevo

Account aperto il 23 settembre 2026 a nome del centro, piano Free (300 email
al giorno), telefono verificato. Fatto:

- Dominio autenticato con la configurazione automatica Cloudflare (brevo-code,
  DKIM `brevo1`/`brevo2`, DMARC `p=none`, CNAME `r` e `img`): nessun SPF
  aggiunto, resta l'unico di Email Routing. Sottodominio brandizzato saltato,
  serve solo a mostrare i link col nostro dominio.
- Mittente `ordini@lafenicecentroestetico.com` (`senderEmail` in `site.ts`),
  verificato. Quello con la Gmail creato da Brevo è stato eliminato.
- Liste "Preordini" (ID 3) e "Newsletter" (ID 4), nei `vars` di
  `wrangler.jsonc`.
- Attributo `BIRTHDAY`, tipo Data.

Da fare:

- Template della doppia conferma, per il consenso marketing dal preordine:
  HTML in `docs/brevo-doi.html`, tag `optin`, mittente `ordini@`. Il suo ID va
  in `BREVO_DOI_TEMPLATE_ID`, oggi 0.
- Chiave API (SMTP e API) e IP autorizzati spenti (Sicurezza): il Worker non
  esce da un IP fisso. La chiave va come Secret del Worker `lafenice`
  (Settings, Variables and Secrets), che sopravvive ai deploy di Workers
  Builds, e in `.dev.vars` per i test del punto 4.

Note sull'attributo **`BIRTHDAY`**: non esiste di default. Il form newsletter lo
manda con la doppia conferma, e Brevo rifiuta
  un attributo sconosciuto: senza, l'iscrizione riesce lo stesso ma la data va
  persa (`sendNewsletter` riprova senza), quindi l'errore non si vede dal sito
  e resta solo nei log. Da verificare al primo test reale, insieme al
  formato della data (mandiamo `YYYY-MM-DD`, come lo scrive `<input type="date">`).
  Serve per le promozioni di compleanno, che si impostano in Brevo come
  automazione sulla data.
- **Autenticare il dominio come mittente** (record DKIM e SPF nel DNS
  Cloudflare). Non è opzionale, vedi sotto.

### Perché la casella Gmail non basta come mittente

`c.elafenice2020@gmail.com` va benissimo per **ricevere** i preordini
(`ordersEmail` in `site.ts`): resta quella, la titolare legge dove è abituata.

Non va come **mittente** delle email che manda Brevo. Autenticare un mittente
vuol dire mettere record DKIM e SPF sul suo dominio, e `gmail.com` non è del
cliente. Da quando Gmail e Yahoo hanno stretto le regole sui mittenti massivi
(2024), una email "da gmail.com" spedita da un server terzo viene respinta o
finisce nello spam, e Brevo rifiuta i mittenti su domini di posta gratuiti.

Conseguenza concreta: Brevo rifiuta la chiamata, `sendPreorder` lancia, il form
risponde 502. Il preordine non arriva nello spam, non si può proprio inviare.

Quindi, quando c'è il dominio:

- Brevo spedisce da `ordini@lafenicecentroestetico.com`, autenticato.
- Cloudflare Email Routing inoltra `ordini@lafenicecentroestetico.com` alla
  Gmail esistente. Attivo dal 23 settembre 2026 e provato con un'email vera;
  catch-all spento, se no lo spam verso indirizzi inventati finirebbe in Gmail.
- In `app/content/site.ts` il mittente (`senderEmail`) è separato dal
  destinatario (`ordersEmail`, la Gmail).
- Per rispondere *con* l'indirizzo del dominio serve un SMTP vero (casella
  Aruba da pochi euro, o Zoho): riguarda solo come la titolare scrive ai suoi
  clienti, non il sito.

## 4. Test reali con la chiave Brevo vera

Due comportamenti sono stati ipotizzati e provati solo con una fetch finta:

- `sendPreorder` crea il contatto e poi chiama
  `/contacts/doubleOptinConfirmation` sullo stesso indirizzo. Che Brevo accetti
  la doppia conferma per un contatto che esiste già è da verificare: se la
  rifiuta, invertire l'ordine o saltare la creazione quando c'è il consenso.
- Stessa chiamata dal form newsletter con un indirizzo già iscritto: se Brevo
  risponde con un errore, l'utente vede "non siamo riusciti a completare
  l'iscrizione" (502). In quel caso trattare quel codice di errore come
  successo.

## 5. Dati del cliente

Sostituire tutti i `PLACEHOLDER`: `grep -rn PLACEHOLDER app`. Ragione sociale,
orari, social, anno di apertura, WhatsApp, costo di spedizione, formato e INCI
del prodotto, foto reali. Senza, Google indicizza dati inventati.

Le foto servono anche per `og:image` (anteprima dei link su WhatsApp e social),
che oggi non c'è: senza, chi condivide il sito vede un riquadro vuoto. La foto
della sala (orizzontale, in `app/assets/studio/`) può già farlo: va copiata in
`public/images/` per avere un URL stabile, e lo stesso URL può sostituire il
favicon come `image` nel JSON-LD `BeautySalon` della home.

## 6. Testi legali: privacy e condizioni di vendita

`/policies/privacy-policy` e `/policies/terms-of-service` sono primi getti
scritti su quello che il sito fa davvero, marcati `PLACEHOLDER`. Prima del
lancio li deve validare un consulente, insieme al punto sotto.

### La parte che non sta sul sito

La pagina da sola non basta: la vendita si conclude via email, e le
informazioni devono arrivare lì. I due modelli in `docs/email-preordine.md`
(uno per il ritiro, uno per la spedizione) vanno passati alla titolare e usati
come sono; il perché sta in quel file.

Da chiedere al consulente mentre ci siamo: l'informativa privacy elenca i dati
raccolti **dal sito** (l'indirizzo di consegna ora è tra questi), ma con la
spedizione arrivano per email anche gli estremi del pagamento. Vanno aggiunti a
"Quali dati raccogliamo".

## 7. Rate limiting sui form (dashboard Cloudflare, nessun codice)

Cloudflare, Security, WAF, Rate limiting rules:

- match: metodo `POST` e path `/pages/newsletter` o che inizia per `/products/`
- conteggio per indirizzo IP
- soglia bassa, cinque richieste in dieci minuti: una persona vera ne fa una
- azione: **Block**, non Managed Challenge. La sfida di Cloudflare su una POST
  perde il corpo della richiesta, quindi romperebbe l'invio a un utente vero
  che finisce sopra soglia. Se si vuole la sfida, va messa sulla GET della
  pagina.

Serve perché una POST a `/pages/newsletter` fa partire da Brevo una email di
conferma verso l'indirizzo scritto nel form, e nessuno verifica che sia di chi
compila. Uno script che posta mille indirizzi altrui manda mille email a nome
del centro e brucia la quota Brevo, che è la stessa da cui escono le notifiche
dei preordini: finita quella, il preordine di un cliente vero non arriva più.

### Perché non una captcha, per ora

L'honeypot ferma i bot che compilano ogni campo, non uno script scritto su
misura. Ma la captcha, qui, costa più di quello che rende:

- il sito non spedisce React al client, e il form newsletter sta nel footer di
  ogni pagina: Turnstile sarebbe uno script di terze parti caricato ovunque;
- senza JS il widget non compare, quindi o si rifiuta l'invio (e il form smette
  di funzionare senza JS, contro le regole del progetto) o lo si accetta lo
  stesso (e la captcha non serve);
- non ferma il caso singolo: chi vuole mandare una conferma sgradita a un
  indirizzo altrui risolve la captcha e la manda. Ferma il volume, come il
  rate limiting, che però costa zero.

Se dopo il lancio si vedono invii ripetuti nonostante il limite, Turnstile va
solo sulle route dei form (che possono idratare da sole con
`handle = { hydrate: true }`), non nel footer globale, con verifica del token
lato server nell'action.

## 8. Dopo la pubblicazione

- Spegnere l'anteprima: disattivare GitHub Pages dalle impostazioni del repo,
  togliere `.github/workflows/preview.yml` e l'eccezione che la cita in
  CLAUDE.md. È pubblica, ha form che non inviano e duplica il sito vero; il
  `noindex` la tiene fuori da Google, non da chi ha il link. Il repo è
  pubblico solo perché Pages sul piano gratuito lo richiede: si può rimettere
  privato.
- Google Business Profile: per un centro estetico è la leva principale della
  SEO locale, più del sito.
- Google Search Console e Bing Webmaster Tools (Bing alimenta ChatGPT search e
  Copilot): verificare il dominio e inviare `/sitemap.xml`.
- Controllare che `/robots.txt` e `/llms.txt` rispondano sul dominio vero.

## Perché Cloudflare e non un hosting condiviso

Deciso il 19 settembre 2026 (commit `9c4a0e3`), ripreso qui perché torna a ogni
discussione sul fornitore.

Il sito non è PHP: le pagine sono HTML statico, ma i due form hanno bisogno di
codice server a ogni invio (valida, chiama Brevo, manda l'email al negozio).
L'hosting condiviso Aruba esegue PHP su Apache, non JavaScript. Le alternative
sarebbero: niente server e form rotti (il `mailto:` è stato escluso apposta,
fallisce senza client di posta configurato e non lascia traccia), riscrivere le
action in PHP (due linguaggi da mantenere, buttati via in caso di passaggio a
Shopify), o un VPS da amministrare.

In più Workers gira su workerd, lo stesso runtime di Shopify Oxygen: se un
domani si passa a Hydrogen, loader, action e componenti si spostano così come
sono. È gratis per uso commerciale (il piano Hobby di Vercel lo vieta) e un
account solo copre DNS, hosting, inoltro email e analytics senza cookie.

Anche il dominio si compra lì (punto 2), ma è una scelta separata: un
registrar esterno funziona lo stesso, al prezzo di un account in più e dei
nameserver da spostare.
