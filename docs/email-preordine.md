# Email di risposta a un preordine

Due modelli da copiare e incollare nella risposta al cliente. Vanno tenuti
separati perché rispondono a due situazioni che la legge tratta in modo
diverso, e la differenza sta tutta in **dove si conclude il contratto**.

Il modulo sul sito è solo una richiesta: non impegna nessuno e non fa pagare
niente. Quello che il cliente riceve per email è il momento che conta.

- **Ritiro in negozio**: la vendita si conclude di persona, in cassa. Nessun
  obbligo da vendita a distanza, niente recesso. Perché resti così, l'email
  deve essere una **prenotazione**, non una conferma d'ordine: se dice "ordine
  confermato, totale X" e il cliente risponde "ok", il contratto si è chiuso
  per email e siamo nel caso della spedizione anche se poi paga in negozio.
- **Spedizione**: si concorda tutto per email e si paga a distanza. È vendita a
  distanza (art. 45 Codice del Consumo): servono le informazioni dell'art. 49 e
  il diritto di recesso di 14 giorni.

I dati del venditore (ragione sociale, indirizzo, P.IVA) sono quelli di
`app/content/site.ts`: se cambiano lì, vanno cambiati anche qui. Il blocco sul
recesso e il modulo tipo sono gli stessi di `app/routes/terms.tsx`: chi ne
corregge uno corregge l'altro.

**Il testo va incollato nell'email, non linkato.** La legge chiede che la
conferma arrivi su "supporto durevole" (art. 51 comma 7): l'email lo è, una
pagina del sito no, perché può cambiare in qualsiasi momento (Corte di
giustizia UE, causa C-49/11). La pagina
[`/policies/terms-of-service`](../app/routes/terms.tsx) dice le stesse cose a
chi legge il sito prima di scrivere, ma non sostituisce l'email.

---

## A. Ritiro in negozio

> Oggetto: La tua richiesta di preordine, Detergente viso Nuvola
>
> Ciao [NOME],
>
> grazie per la richiesta. Ti confermo che il prodotto sarà disponibile
> indicativamente [DATA/PERIODO]: te ne metto da parte [QUANTITÀ] e ti avviso
> appena arriva.
>
> Il prezzo è di [TOTALE] euro, IVA inclusa. Non devi anticipare nulla: paghi
> qui in negozio quando vieni a ritirarlo, e in quel momento decidi se
> confermare o lasciar perdere, senza impegno.
>
> Siamo in [INDIRIZZO], aperti [ORARI].
>
> A presto,
> Micaela Brunetti, Centro Estetico La Fenice
> [TELEFONO] - [EMAIL]

Da non scrivere in questa email: "ordine confermato", "procedo con l'ordine",
un totale presentato come già dovuto, o la richiesta di rispondere per
accettare. Sono le frasi che spostano la vendita online.

---

## B. Spedizione

Contiene tutto quello che l'art. 49 chiede di dire prima che il cliente si
impegni. Le parti tra parentesi quadre vanno compilate.

> Oggetto: Il tuo preordine, Detergente viso Nuvola: conferma e spedizione
>
> Ciao [NOME],
>
> grazie per la richiesta. Ecco il riepilogo completo prima che tu decida.
>
> **Prodotto**: Detergente viso Nuvola, [QUANTITÀ] pezzi, [FORMATO] ml.
> **Prezzo**: [PREZZO] euro l'uno, IVA inclusa.
> **Spedizione**: [COSTO] euro con [CORRIERE].
> **Totale**: [TOTALE] euro, IVA e spedizione incluse. Non ci sono altri costi.
> **Consegna**: prevista entro [DATA], all'indirizzo che mi indichi.
> **Pagamento**: bonifico bancario su IBAN [IBAN], intestato a Micaela
> Brunetti [oppure: l'altro mezzo che usi davvero]. Spedisco appena ricevo il
> pagamento.
>
> **Per confermare rispondi a questa email scrivendo "confermo l'ordine e il
> pagamento"**, con l'indirizzo di spedizione completo. Finché non lo fai non
> c'è nessun impegno.
>
> **Garanzia legale**: sul prodotto vale la garanzia legale di conformità di
> due anni prevista dagli articoli 128 e seguenti del Codice del Consumo. Se
> arriva difettoso o diverso da come descritto, scrivimi.
>
> **Diritto di recesso**: hai 14 giorni dalla consegna per ripensarci, senza
> dover dare spiegazioni. Basta che me lo comunichi con una email a [EMAIL] o
> con il modulo qui sotto; ti confermo di averla ricevuta. Rispedisci il
> prodotto entro 14 giorni dalla comunicazione a [INDIRIZZO], con le spese di
> restituzione a tuo carico. Ti rimborso entro 14 giorni da quando mi comunichi
> il recesso, comprese le spese di consegna che avevi pagato, con lo stesso
> mezzo di pagamento che hai usato; posso aspettare a farlo finché non ricevo
> il reso o la prova che l'hai spedito.
> Il recesso non vale per i cosmetici sigillati che sono stati aperti dopo la
> consegna, per ragioni di igiene (articolo 59, lettera e, del Codice del
> Consumo): se vuoi tenerti la possibilità di restituirlo, non aprire il
> sigillo.
>
> **Modulo tipo di recesso** (compilalo solo se vuoi recedere):
>
> Destinatario: Micaela Brunetti, [INDIRIZZO], [EMAIL]
> Con la presente io/noi comunico/comunichiamo il recesso dal mio/nostro
> contratto di vendita dei seguenti beni:
> Ordinato il / ricevuto il:
> Nome del consumatore:
> Indirizzo del consumatore:
> Data:
> Firma del consumatore (solo se il modulo è inviato in forma cartacea):
>
> **Reclami**: scrivimi a [EMAIL] o chiamami al [TELEFONO], rispondo a tutti.
>
> Micaela Brunetti, Centro Estetico La Fenice
> [INDIRIZZO] - P.IVA 11407830964

Se il recesso non viene comunicato al cliente, i 14 giorni diventano 12 mesi e
14 giorni (art. 53 Codice del Consumo). È il motivo per cui questo blocco di
testo non si accorcia.
