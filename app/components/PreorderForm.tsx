import { Form } from "react-router";
import { site } from "~/content/site";
import {
  deliveryOptions,
  type PreorderErrors,
  type PreorderValues,
  quantities,
} from "~/lib/preorder";
import styles from "./Form.module.scss";

// Plain POST to the route action: works without JS. The browser's native
// validation catches most mistakes first; the server re-validates and, on
// errors, sends the page back with messages and the typed values filled in.
export function PreorderForm({
  action,
  values,
  errors = {},
  formError = false,
}: {
  // Explicit: prerendered pages would otherwise post to "/path/".
  action: string;
  values?: PreorderValues;
  errors?: PreorderErrors;
  formError?: boolean;
}) {
  // Wires label, error text and aria attributes for one field.
  const field = (name: keyof PreorderErrors) => ({
    id: `preorder-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `preorder-${name}-error` : undefined,
  });
  const error = (name: keyof PreorderErrors) =>
    errors[name] && (
      <p id={`preorder-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    );

  return (
    <Form method="post" action={action} className={styles.form}>
      {formError && (
        <p className={styles.formError} role="alert">
          Non siamo riusciti a inviare la richiesta. Riprova tra poco oppure
          scrivici a{" "}
          <a href={`mailto:${site.ordersEmail}`}>{site.ordersEmail}</a>.
        </p>
      )}

      {/* The order is concluded by email, so this is where the visitor is
          told how it works, before sending anything. The detail (price,
          shipping, payment, withdrawal) is in the sale terms.
          PLACEHOLDER: "con bonifico" until the client says which other means
          she takes (docs/domande-cliente.md). Same sentence in terms.tsx. */}
      <p className={styles.intro}>
        Il modulo è una richiesta, non un ordine. Ti rispondiamo per email con
        disponibilità, totale e spese di spedizione: l'ordine si conclude solo
        quando lo confermi, pagando in negozio al ritiro o con bonifico se
        preferisci riceverlo a casa.{" "}
        <a href="/policies/terms-of-service">Condizioni di vendita</a>.
      </p>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="preorder-name">Nome e cognome *</label>
          <input
            {...field("name")}
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={values?.name}
          />
          {error("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="preorder-email">Email *</label>
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
        <div className={styles.field}>
          <label htmlFor="preorder-phone">Telefono</label>
          <input
            {...field("phone")}
            type="tel"
            autoComplete="tel"
            maxLength={30}
            defaultValue={values?.phone}
          />
          {error("phone")}
        </div>
        <div className={styles.field}>
          <label htmlFor="preorder-quantity">Quantità</label>
          <select {...field("quantity")} defaultValue={values?.quantity}>
            {quantities.map((q) => (
              <option key={q}>{q}</option>
            ))}
          </select>
          {error("quantity")}
        </div>
        <div className={styles.field}>
          <label htmlFor="preorder-delivery">Come vuoi riceverlo *</label>
          <select
            {...field("delivery")}
            required
            defaultValue={values?.delivery ?? ""}
          >
            <option value="">Scegli...</option>
            {deliveryOptions.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          {error("delivery")}
        </div>
      </div>

      {/* Required only with the shipping option, so it cannot be `required`
          here: the browser would block the pickup requests too. The server
          decides, as for every other field. */}
      <div className={styles.field}>
        <label htmlFor="preorder-address">Indirizzo di consegna</label>
        <textarea
          {...field("address")}
          rows={2}
          maxLength={300}
          autoComplete="street-address"
          placeholder="Via e numero, CAP, città, provincia"
          defaultValue={values?.address}
        />
        <span className={styles.hint}>
          Serve solo se scegli la spedizione: senza non possiamo dirti quanto
          costa.
        </span>
        {error("address")}
      </div>

      <div className={styles.field}>
        <label htmlFor="preorder-notes">Note (facoltative)</label>
        <textarea
          {...field("notes")}
          rows={3}
          maxLength={1000}
          placeholder="Citofono, orari, richieste particolari..."
          defaultValue={values?.notes}
        />
        {error("notes")}
      </div>

      <div className={styles.check}>
        <input
          {...field("privacy")}
          type="checkbox"
          required
          defaultChecked={values?.privacy}
        />
        <label htmlFor="preorder-privacy">
          Ho letto l'
          <a href="/policies/privacy-policy">informativa privacy</a> *
        </label>
        {error("privacy")}
      </div>
      <div className={styles.check}>
        <input
          id="preorder-marketing"
          name="marketing"
          type="checkbox"
          defaultChecked={values?.marketing}
        />
        <label htmlFor="preorder-marketing">
          Voglio ricevere novità e promozioni via email (facoltativo, puoi
          disiscriverti quando vuoi)
        </label>
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
          Invia richiesta di preordine
        </button>
        {/* The intro says it too, but on a phone it has scrolled away by the
            time you reach the button, which is where people hesitate. */}
        <span className={styles.hint}>Nessun pagamento ora.</span>
      </div>
    </Form>
  );
}
