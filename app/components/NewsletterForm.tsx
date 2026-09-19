import { useId } from "react";
import { Form } from "react-router";
import type { NewsletterErrors, NewsletterValues } from "~/lib/newsletter";
import styles from "./Form.module.scss";

// In the footer of every (prerendered) page and on /pages/newsletter, which
// receives the POST and is the only place server errors are shown. Works
// without JS, like PreorderForm.
export function NewsletterForm({
  values,
  errors = {},
  formError = false,
}: {
  values?: NewsletterValues;
  errors?: NewsletterErrors;
  formError?: boolean;
}) {
  // The newsletter page renders the form twice (page + footer): ids must differ.
  const id = useId();
  const field = (name: keyof NewsletterErrors) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });
  const error = (name: keyof NewsletterErrors) =>
    errors[name] && (
      <p id={`${id}-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    );

  return (
    <Form
      method="post"
      action="/pages/newsletter"
      className={styles.newsletter}
    >
      {formError && (
        <p className={styles.formError} role="alert">
          Non siamo riusciti a completare l'iscrizione. Riprova tra poco.
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor={`${id}-email`}>Email *</label>
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

      <div className={styles.check}>
        <input {...field("consent")} type="checkbox" required />
        <label htmlFor={`${id}-consent`}>
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
        <span className={styles.hint}>
          Ti scriviamo per confermare. Puoi disiscriverti quando vuoi.
        </span>
      </div>
    </Form>
  );
}
