import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/newsletter-thanks";

// Redirect target after the signup form, like /pages/grazie-preordine.
export function meta(_: Route.MetaArgs) {
  return [
    ...pageMeta(
      {
        title: "Conferma l'iscrizione | La Fenice",
        description: "Controlla la tua email per confermare l'iscrizione.",
      },
      "/pages/grazie-newsletter",
    ),
    { name: "robots", content: "noindex" },
  ];
}

export default function NewsletterThanks() {
  return (
    <main className="wrap section">
      <p className="eyebrow">Newsletter</p>
      <h1>Controlla la tua email</h1>
      <p>
        Ti abbiamo scritto: apri il messaggio e tocca il link di conferma per
        completare l'iscrizione. Se non lo trovi, guarda nello spam.
      </p>
      <a className="btn" href="/">
        Torna alla home
      </a>
    </main>
  );
}
