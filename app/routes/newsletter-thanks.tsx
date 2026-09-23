import { site } from "~/content/site";
import { pageMeta } from "~/lib/seo";

// Redirect target after the signup form, like /pages/grazie-preordine.
export const handle = { hideNewsletter: true };

export function meta() {
  return pageMeta(
    {
      title: `Iscrizione completata | ${site.name}`,
      description: "La tua iscrizione alla newsletter è completata.",
      noindex: true,
    },
    "/pages/grazie-newsletter",
  );
}

export default function NewsletterThanks() {
  return (
    <main className="wrap section">
      <p className="eyebrow">Newsletter</p>
      <h1>Iscrizione completata</h1>
      <p>
        Da ora riceverai le nostre novità e promozioni. Puoi disiscriverti
        quando vuoi dal link in fondo a ogni email.
      </p>
      <a className="btn" href="/">
        Torna alla home
      </a>
    </main>
  );
}
