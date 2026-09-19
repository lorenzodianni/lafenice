import { isEmail } from "./brevo";

export type NewsletterValues = { email: string; consent: boolean };
export type NewsletterErrors = Partial<Record<keyof NewsletterValues, string>>;

// Server-side validation, like parsePreorder: HTML attributes are a convenience.
export function parseNewsletter(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const values: NewsletterValues = {
    email: text("email"),
    consent: form.get("consent") === "on",
  };

  const errors: NewsletterErrors = {};
  if (!isEmail(values.email))
    errors.email = "Inserisci un indirizzo email valido.";
  if (!values.consent)
    errors.consent = "Conferma per iscriverti alla newsletter.";

  // Honeypot: hidden from people, bots fill it in.
  const spam = text("website") !== "";

  return { values, errors, spam };
}
