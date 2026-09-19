import { site } from "~/content/site";
import { pageMeta } from "~/lib/seo";

// Target of the post-submit redirect: a refresh cannot resend the form, and
// the URL counts conversions in analytics. Not meant for search results.
export function meta() {
  return pageMeta(
    {
      title: `Richiesta di preordine inviata | ${site.name}`,
      description: "Grazie per la richiesta di preordine.",
      noindex: true,
    },
    "/pages/grazie-preordine",
  );
}

export default function PreorderThanks() {
  return (
    <main className="wrap section">
      <p className="eyebrow">Preordine</p>
      <h1>Grazie, richiesta inviata</h1>
      <p>
        Ti ricontattiamo presto per confermare disponibilità e tempi di
        consegna. Nessun pagamento è stato richiesto.
      </p>
      <p>
        Se hai scelto di ricevere novità e promozioni, controlla la tua email e
        conferma l'iscrizione.
      </p>
      <a className="btn" href="/">
        Torna alla home
      </a>
    </main>
  );
}
