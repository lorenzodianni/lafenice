import { isEmail } from "./brevo";

export type NewsletterValues = { email: string };
export type NewsletterErrors = Partial<Record<"email" | "consent", string>>;

// Server-side validation, like parsePreorder: HTML attributes are a convenience.
export function parseNewsletter(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const values: NewsletterValues = { email: text("email") };

  const errors: NewsletterErrors = {};
  if (!isEmail(values.email))
    errors.email = "Inserisci un indirizzo email valido.";
  if (form.get("consent") !== "on")
    errors.consent = "Conferma per iscriverti alla newsletter.";

  // Honeypot: hidden from people, bots fill it in.
  const spam = text("website") !== "";

  return { values, errors, spam };
}
