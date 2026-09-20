import { fullAddress, phoneHref, site } from "~/content/site";
import { pageMeta } from "~/lib/seo";
import styles from "./legal.module.scss";

// PLACEHOLDER: written from what the shop actually does (richiesta dal sito,
// email con totale e spedizione, pagamento in negozio o con bonifico). A
// consultant has to validate it before the go live, and the points marked
// below need the client's answer first. See docs/email-preordine.md: the same
// information has to travel in the confirmation email, which is the durable
// medium the law asks for.
export function meta() {
  return pageMeta(
    {
      title: `Condizioni di vendita | ${site.name}`,
      description: `Come funziona il preordine di ${site.name}: prezzi, spedizione, pagamento, garanzia legale e diritto di recesso.`,
    },
    "/policies/terms-of-service",
  );
}

export default function Terms() {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;

  return (
    <main className={`wrap section ${styles.page}`}>
      <p className="eyebrow">Condizioni</p>
      <h1>Condizioni di vendita</h1>
      <p className={styles.updated}>Ultimo aggiornamento: settembre 2026</p>
      <p>
        Queste condizioni regolano l'acquisto dei prodotti di {site.legalName} a
        seguito di una richiesta di preordine inviata dal sito. Si applicano
        agli acquisti fatti da consumatori e seguono il Codice del Consumo
        (D.Lgs. 206/2005).
      </p>

      <h2>Venditore</h2>
      <p>
        {site.legalName}, {fullAddress}, P.IVA {site.vatId}.
        <br />
        Email {mail}, telefono <a href={phoneHref}>{site.phone}</a>.
      </p>

      <h2>Come funziona il preordine</h2>
      <p>
        Il modulo di preordine è una <b>richiesta, non un ordine</b>: inviarlo
        non ti impegna a nulla e non comporta alcun pagamento.
      </p>
      <ol>
        <li>Ci mandi la richiesta dal sito.</li>
        <li>
          Ti rispondiamo per email con la disponibilità, il prezzo totale, le
          eventuali spese di spedizione, i mezzi di pagamento e i tempi di
          consegna.
        </li>
        <li>Scegli se ritirare in negozio o ricevere il prodotto a casa.</li>
        <li>
          L'ordine si conclude quando lo confermi: <b>in negozio</b>, al momento
          del ritiro e del pagamento, oppure <b>per email</b>, se chiedi la
          spedizione.
        </li>
      </ol>
      <p>
        Tutte le informazioni sul prodotto, sul prezzo e sulla consegna te le
        diamo nell'email di risposta, prima che tu confermi.
      </p>

      <h2>Prezzi e spese di spedizione</h2>
      <p>
        Il prezzo indicato sul sito è in euro e comprende l'IVA. Le spese di
        spedizione sono escluse: dipendono dalla quantità e dalla destinazione,
        e te le comunichiamo nell'email di risposta prima della conferma. Con il
        ritiro in negozio non ci sono spese di spedizione.
      </p>

      <h2>Pagamento</h2>
      <p>
        Sul sito non si paga nulla e il modulo non raccoglie dati di pagamento.
        Se ritiri in negozio paghi al ritiro; se chiedi la spedizione paghi con
        bonifico bancario o con gli altri mezzi indicati nell'email di risposta,
        prima che il prodotto parta.
      </p>

      <h2>Consegna</h2>
      <p>
        Consegniamo in Italia. Il prodotto è in preordine: la data stimata è
        quella indicata nella scheda del prodotto e te la confermiamo per email
        prima dell'ordine. Se non riusciamo a rispettarla ti proponiamo una
        nuova data: se non ti va bene puoi annullare l'ordine e ti rimborsiamo
        quanto hai già pagato.
      </p>

      <h2>Garanzia legale di conformità</h2>
      <p>
        Su tutti i prodotti venduti a un consumatore vale la garanzia legale di
        conformità di due anni prevista dagli articoli 128 e seguenti del Codice
        del Consumo. Se il prodotto è difettoso o diverso da come è stato
        descritto, scrivici a {mail}: hai diritto alla riparazione o alla
        sostituzione e, nei casi previsti dalla legge, alla riduzione del prezzo
        o alla risoluzione del contratto.
      </p>

      <h2 id="recesso">Diritto di recesso</h2>
      <p>
        Se hai concluso l'ordine per email e ricevi il prodotto <b>spedito</b>,
        hai 14 giorni dalla consegna per ripensarci, senza dover dare
        spiegazioni (articoli 52 e seguenti del Codice del Consumo). Se invece
        ritiri e paghi in negozio l'acquisto avviene di persona e il diritto di
        recesso non si applica.
      </p>
      <p>
        Per esercitarlo ti basta dircelo entro i 14 giorni con una dichiarazione
        esplicita: una email a {mail} oppure il modulo qui sotto. Ti confermiamo
        di averla ricevuta.
      </p>
      <p>
        Restituisci il prodotto entro 14 giorni da quando ci hai comunicato il
        recesso, all'indirizzo qui sopra. Le spese di restituzione sono a tuo
        carico. Ti rimborsiamo entro 14 giorni da quando ci comunichi il
        recesso, comprese le spese di consegna che avevi pagato, con lo stesso
        mezzo di pagamento che hai usato tu: possiamo aspettare a farlo finché
        non riceviamo il reso o la prova che l'hai spedito.
      </p>
      <p>
        <b>Attenzione</b>: il recesso non vale per i cosmetici sigillati che
        sono stati aperti dopo la consegna, per ragioni di igiene e di
        protezione della salute (articolo 59, lettera e, del Codice del
        Consumo). Se vuoi tenerti la possibilità di restituire il prodotto, non
        rimuovere il sigillo.
      </p>

      <h3>Modulo tipo di recesso</h3>
      <p>Compilalo e inviacelo solo se vuoi recedere dal contratto.</p>
      <pre className={styles.formModel}>
        {`Destinatario: ${site.legalName}, ${fullAddress}, ${site.email}

Con la presente io/noi comunico/comunichiamo il recesso dal mio/nostro contratto di vendita dei seguenti beni:

Ordinato il / ricevuto il:
Nome del consumatore:
Indirizzo del consumatore:
Data:
Firma del consumatore (solo se il modulo è inviato in forma cartacea):`}
      </pre>

      <h2>Reclami</h2>
      <p>
        Per qualsiasi problema scrivici a {mail} o chiamaci: rispondiamo a tutti
        i reclami. Se non troviamo un accordo puoi rivolgerti a un organismo di
        risoluzione alternativa delle controversie (ADR) iscritto negli elenchi
        ministeriali, oppure al giudice del luogo in cui risiedi.
      </p>
    </main>
  );
}
