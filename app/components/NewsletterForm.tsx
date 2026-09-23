import { Form } from "react-router";
import { products } from "~/content/products";
import type { NewsletterErrors, NewsletterValues } from "~/lib/newsletter";
import styles from "./Form.module.scss";

export const newsletterPitch = `Promozioni, nuovi trattamenti e il lancio del ${products[0].title}. Poche email, niente spam.`;

// In the footer of every (prerendered) page and on /pages/newsletter, which
// receives the POST and is the only place server errors are shown. Works
// without JS, like PreorderForm. One per page: newsletter routes hide the
// footer one (handle.hideNewsletter), so the ids are static.
export function NewsletterForm({
  values,
  errors = {},
  formError = false,
}: {
  values?: NewsletterValues;
  errors?: NewsletterErrors;
  formError?: boolean;
}) {
  const field = (name: keyof NewsletterErrors) => ({
    id: `newsletter-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `newsletter-${name}-error` : undefined,
  });
  const error = (name: keyof NewsletterErrors) =>
    errors[name] && (
      <p id={`newsletter-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    );

  return (
    <Form method="post" action="/pages/newsletter" className={styles.narrow}>
      {formError && (
        <p className={styles.formError} role="alert">
          Non siamo riusciti a completare l'iscrizione. Riprova tra poco.
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="newsletter-email">Email *</label>
        <input
          {...field("email")}
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          defaultValue={values?.email}
        />
        {error("email")}
      </div>

      {/* Optional, and it stays optional: the subscription must not depend on
          it. Native date input, no picker library. */}
      <div className={styles.field}>
        <label htmlFor="newsletter-birthday">Data di nascita</label>
        <input
          {...field("birthday")}
          type="date"
          autoComplete="bday"
          defaultValue={values?.birthday}
        />
        <span className={styles.hint}>
          Facoltativa: ci serve solo per mandarti una promozione per il tuo
          compleanno.
        </span>
        {error("birthday")}
      </div>

      <div className={styles.check}>
        <input
          {...field("consent")}
          type="checkbox"
          required
          defaultChecked={values?.consent}
        />
        <label htmlFor="newsletter-consent">
          Voglio ricevere novità e promozioni via email e ho letto l'
          <a href="/policies/privacy-policy">informativa privacy</a> *
        </label>
        {error("consent")}
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <div className={styles.hp} aria-hidden="true">
        <label>
          Lascia vuoto
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn">
          Iscriviti
        </button>
        <span className={styles.hint}>Puoi disiscriverti quando vuoi.</span>
      </div>
    </Form>
  );
}
