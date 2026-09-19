import { site } from "~/content/site";
import { CONFIRMED_PATH } from "~/lib/brevo";
import { pageMeta } from "~/lib/seo";

// Where the link in Brevo's double opt-in email lands.
export const handle = { hideNewsletter: true };

export function meta() {
  return pageMeta(
    {
      title: `Iscrizione confermata | ${site.name}`,
      description: "La tua iscrizione alla newsletter è confermata.",
      noindex: true,
    },
    CONFIRMED_PATH,
  );
}

export default function NewsletterConfirmed() {
  return (
    <main className="wrap section">
      <p className="eyebrow">Newsletter</p>
      <h1>Iscrizione confermata</h1>
      <p>
        Grazie! Riceverai le novità e le promozioni del centro. Puoi
        disiscriverti in qualsiasi momento dal link in fondo a ogni email.
      </p>
      <a className="btn" href="/">
        Torna alla home
      </a>
    </main>
  );
}
