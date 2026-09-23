import { type BrevoConfig, isEmail, upsertContact } from "./brevo";

export type NewsletterValues = {
  email: string;
  consent: boolean;
  birthday: string;
};
export type NewsletterErrors = Partial<Record<keyof NewsletterValues, string>>;

// `<input type="date">` sends YYYY-MM-DD, which is also what Brevo stores: the
// value goes through untouched. Date parses 1985-02-31 into 3 March instead of
// refusing it, so the check is that the date writes itself back unchanged.
const isBirthday = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < "1900-01-01") return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    date.valueOf() <= Date.now() && date.toISOString().startsWith(`${value}T`)
  );
};

// Server-side validation, like parsePreorder: HTML attributes are a convenience.
export function parseNewsletter(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const values: NewsletterValues = {
    email: text("email"),
    consent: form.get("consent") === "on",
    birthday: text("birthday"),
  };

  const errors: NewsletterErrors = {};
  if (!isEmail(values.email))
    errors.email = "Inserisci un indirizzo email valido.";
  // Optional: it only serves the birthday promotion, never the subscription.
  if (values.birthday && !isBirthday(values.birthday))
    errors.birthday = "Controlla la data di nascita.";
  if (!values.consent)
    errors.consent = "Conferma per iscriverti alla newsletter.";

  // Honeypot: hidden from people, bots fill it in.
  const spam = text("website") !== "";

  return { values, errors, spam };
}

// Brevo is the only store, as for the preorder. The signup goes straight into
// the list, no confirmation email (the client's choice): the proof of consent
// is the form itself, with Brevo's creation date. The birthday is optional and
// must never cost a subscriber: if Brevo refuses the attribute, which has to
// exist in the account (docs/rollout.md), the subscription is retried without.
export async function sendNewsletter(
  values: NewsletterValues,
  config: BrevoConfig,
  fetchFn: typeof fetch = fetch,
) {
  const subscribe = (attributes?: Record<string, string>) =>
    upsertContact(
      values.email,
      config.newsletterListId,
      config,
      attributes,
      fetchFn,
    );
  if (!values.birthday) return subscribe();

  try {
    await subscribe({ BIRTHDAY: values.birthday });
  } catch (error) {
    console.warn("Brevo refused the birthday, subscribing without it", error);
    await subscribe();
  }
}
