import { fullAddress, phoneHref, site } from "~/content/site";
import { pageMeta } from "~/lib/seo";
import styles from "./privacy.module.scss";

// PLACEHOLDER: draft written from what the site actually does (see brevo.ts,
// preorder.ts, newsletter.ts). A consultant has to validate it before the go
// live, and the field lists below have to follow parsePreorder/parseNewsletter.
export function meta() {
  return pageMeta(
    {
      title: `Informativa privacy | ${site.name}`,
      description: `Come ${site.legalName} tratta i dati raccolti dai moduli di preordine e newsletter: finalità, base giuridica, conservazione e diritti.`,
    },
    "/policies/privacy-policy",
  );
}

export default function Privacy() {
  return (
    <main className={`wrap section ${styles.page}`}>
      <p className="eyebrow">Privacy</p>
      <h1>Informativa privacy</h1>
      <p className={styles.updated}>Ultimo aggiornamento: settembre 2026</p>
      <p>
        Questa pagina spiega quali dati personali raccogliamo attraverso il
        sito, perché li trattiamo e come puoi controllarli. È resa ai sensi
        degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR).
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        {site.legalName}, {fullAddress}, P.IVA {site.vatId}.
        <br />
        Per ogni richiesta puoi scriverci a{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> o chiamare il{" "}
        <a href={phoneHref}>{site.phone}</a>.
        <br />
        Non abbiamo nominato un responsabile della protezione dei dati (DPO): la
        nostra attività non rientra tra quelle che ne impongono la nomina.
      </p>

      <h2>Quali dati raccogliamo</h2>
      <ul>
        <li>
          <b>Modulo di preordine</b>: nome, email e quantità (obbligatori),
          telefono e note (facoltativi), la presa visione di questa informativa
          e l'eventuale consenso a ricevere novità e promozioni.
        </li>
        <li>
          <b>Modulo newsletter</b>: il tuo indirizzo email e il consenso a
          ricevere le nostre comunicazioni.
        </li>
        <li>
          <b>Dati tecnici</b>: i fornitori che ospitano il sito registrano, per
          sicurezza e diagnostica, indirizzo IP, data e ora della richiesta,
          pagina richiesta e tipo di browser. Non li usiamo per identificarti né
          per profilarti.
        </li>
      </ul>
      <p>
        Non chiediamo dati relativi alla salute e non raccogliamo dati tramite
        il sito per la prenotazione dei trattamenti, che si fissano per telefono
        o di persona.
      </p>

      <h2>Perché li trattiamo</h2>
      <ul>
        <li>
          <b>Gestire il tuo preordine</b> e ricontattarti per confermare
          disponibilità, tempi e modalità di consegna: base giuridica art. 6.1
          lett. b del GDPR (misure precontrattuali adottate su tua richiesta).
          Nome ed email sono necessari: senza non possiamo risponderti.
        </li>
        <li>
          <b>Inviarti novità e promozioni</b>: base giuridica art. 6.1 lett. a
          (consenso). Il consenso è facoltativo, separato da ogni altro e lo
          confermi cliccando il link che ti inviamo per email (doppia conferma).
          Puoi revocarlo in qualsiasi momento dal link di disiscrizione presente
          in fondo a ogni messaggio o scrivendoci.
        </li>
        <li>
          <b>Sicurezza del sito e obblighi di legge</b> (contabili e fiscali):
          base giuridica art. 6.1 lett. f e lett. c.
        </li>
      </ul>

      <h2>Per quanto tempo li conserviamo</h2>
      <ul>
        <li>
          Richieste di preordine: per il tempo necessario a gestirle e, se si
          trasformano in un acquisto, per i termini imposti dalla normativa
          fiscale (dieci anni).
        </li>
        <li>
          Iscrizione alla newsletter: fino a quando revochi il consenso. La
          prova del consenso resta archiviata per poter dimostrare di averlo
          raccolto correttamente.
        </li>
        <li>
          Dati tecnici: per il tempo di conservazione dei log dei nostri
          fornitori, in genere pochi giorni.
        </li>
      </ul>

      <h2>A chi comunichiamo i dati</h2>
      <p>
        I tuoi dati non vengono venduti né ceduti a terzi per finalità di
        marketing proprie. Li trattano per nostro conto, come responsabili ai
        sensi dell'art. 28 del GDPR, solo i fornitori che ci servono per far
        funzionare il sito e le comunicazioni:
      </p>
      <ul>
        <li>
          <b>Brevo</b> (Sendinblue SAS, Francia): gestione dei contatti, doppia
          conferma dell'iscrizione e invio delle email.
        </li>
        <li>
          <b>Cloudflare, Inc.</b>: hosting e protezione del sito.
        </li>
        <li>
          Il fornitore della nostra casella di posta elettronica, che riceve le
          richieste di preordine.
        </li>
      </ul>
      <p>
        Alcuni di questi fornitori possono trattare i dati anche fuori
        dall'Unione europea: in quel caso il trasferimento avviene sulla base
        delle clausole contrattuali standard approvate dalla Commissione
        europea.
      </p>

      <h2>Cookie</h2>
      <p>
        Questo sito non usa cookie di profilazione, non fa pubblicità
        comportamentale e non incorpora mappe, video o widget di terzi che
        possano tracciarti. Per questo non trovi nessun banner da accettare.
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiederci in qualsiasi momento l'accesso ai tuoi dati, la
        rettifica, la cancellazione, la limitazione o la portabilità, e puoi
        opporti al trattamento (artt. da 15 a 22 del GDPR). Scrivi a{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>: ti rispondiamo entro
        un mese. Non prendiamo decisioni automatizzate né facciamo profilazione.
      </p>
      <p>
        Se ritieni che il trattamento dei tuoi dati violi il GDPR puoi
        presentare reclamo al Garante per la protezione dei dati personali (
        <a href="https://www.garanteprivacy.it">garanteprivacy.it</a>).
      </p>

      <h2>Modifiche</h2>
      <p>
        Se cambiamo il modo in cui trattiamo i dati aggiorniamo questa pagina e
        la data indicata in alto.
      </p>
    </main>
  );
}
