import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/newsletter-confirmed";

// Where the link in Brevo's double opt-in email lands (CONFIRMED_PATH).
export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta(
      {
        title: "Iscrizione confermata | La Fenice",
        description: "La tua iscrizione alla newsletter è confermata.",
      },
      "/pages/iscrizione-confermata",
    ),
    { name: "robots", content: "noindex" },
  ];
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
