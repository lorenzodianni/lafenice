# Rollout: cosa fare prima di pubblicare

Ordine consigliato: ogni punto sblocca i successivi. Qui sta anche il perché di
ogni scelta, così non si ridiscute a distanza di mesi. I dubbi ancora aperti
restano in `worklog.md`.

## 1. Dominio (blocca tutto il resto)

Registrare `lafenice-estetica.it` (o quello che si sceglie) presso un registrar
italiano: Aruba, Namecheap, OVH, 10-15 euro l'anno. Cloudflare Registrar vende
a prezzo di costo ma copre un elenco limitato di estensioni e quasi
sicuramente non fa `.it`: da verificare in dashboard, altrimenti si compra
altrove.

Poi puntare i nameserver del dominio su Cloudflare. Il registrar resta dove si
è comprato, il DNS lo gestisce Cloudflare: servono a cose diverse.

Finito questo, aggiornare `site.url` in `app/content/site.ts` (oggi
`PLACEHOLDER`): è la base di canonical, Open Graph, JSON-LD, sitemap e
llms.txt.

## 2. Cloudflare

Account a carico del cliente. Serve per: DNS, hosting del Worker, Email
Routing e Web Analytics (senza cookie, quindi nessun banner).

Workers Builds collegato al repo: build `npm run build`, deploy
`npx wrangler deploy` (legge la config generata in `build/server/wrangler.json`
tramite `.wrangler/deploy/config.json`).

## 3. Brevo

Account, poi:

- API key come secret del Worker: `npx wrangler secret put BREVO_API_KEY`.
- Liste "Preordini" e "Newsletter" e template della doppia conferma: i tre ID
  vanno nei `vars` di `wrangler.jsonc`, oggi valgono 0.
- Attributo contatto **`BIRTHDAY`, tipo Date**, da creare a mano: non esiste di
  default. Il form newsletter lo manda con la doppia conferma, e Brevo rifiuta
  un attributo sconosciuto: senza, ogni iscrizione con la data di nascita
  compilata finisce in errore. Da verificare al primo test reale, insieme al
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

- Brevo spedisce da `ordini@dominio`, autenticato.
- Cloudflare Email Routing inoltra `ordini@dominio` alla Gmail esistente.
- In `app/content/site.ts` va separato il mittente dal destinatario: oggi
  `app/lib/preorder.ts` usa `site.ordersEmail` per entrambi.
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
che oggi non c'è: gli SVG placeholder non sono validi come Open Graph.

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
raccolti **dal sito**, ma con la spedizione arrivano per email anche indirizzo
di consegna ed estremi del pagamento. Vanno aggiunti a "Quali dati
raccogliamo".

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

Il registrar del dominio è un'altra cosa e può restare Aruba o chi si vuole.
