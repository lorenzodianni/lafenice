import { site } from "~/content/site";
import { type BrevoConfig, brevo, doubleOptin, isEmail } from "./brevo";

export const quantities = ["1", "2", "3", "4", "5 o più"];
// Decides which of the two email models the shop answers with: pickup closes
// the sale in the shop, shipping closes it by email and is a distance sale
// (see docs/email-preordine.md). No default, it has to be a real choice.
export const deliveryOptions = ["Ritiro in negozio", "Spedizione a casa"];

const PHONE = /^[+\d\s().-]*$/;

// The privacy page lists these fields and says which are required: keep the
// two in sync, it is what the visitor consents to.
export type PreorderValues = {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  delivery: string;
  notes: string;
  privacy: boolean;
  marketing: boolean;
};
export type PreorderErrors = Partial<
  Record<Exclude<keyof PreorderValues, "marketing">, string>
>;

// Server-side validation: the form's HTML attributes are only a convenience.
export function parsePreorder(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  // Single-line fields: collapse newlines/tabs, they end up in an email subject.
  const line = (key: string) => text(key).replace(/\s+/g, " ");

  const values: PreorderValues = {
    name: line("name"),
    email: line("email"),
    phone: line("phone"),
    quantity: line("quantity"),
    delivery: line("delivery"),
    notes: text("notes"),
    privacy: form.get("privacy") === "on",
    marketing: form.get("marketing") === "on",
  };

  const errors: PreorderErrors = {};
  if (!values.name || values.name.length > 100)
    errors.name = "Inserisci nome e cognome.";
  if (!isEmail(values.email))
    errors.email = "Inserisci un indirizzo email valido.";
  if (values.phone.length > 30 || !PHONE.test(values.phone))
    errors.phone = "Inserisci un numero di telefono valido.";
  if (!quantities.includes(values.quantity))
    errors.quantity = "Scegli una quantità.";
  if (!deliveryOptions.includes(values.delivery))
    errors.delivery = "Scegli se ritirare in negozio o farti spedire l'ordine.";
  if (values.notes.length > 1000) errors.notes = "Massimo 1000 caratteri.";
  if (!values.privacy)
    errors.privacy = "Conferma di aver letto l'informativa privacy.";

  // Honeypot: hidden from people, bots fill it in.
  const spam = text("website") !== "";

  return { values, errors, spam };
}

// Brevo stores the contact (our only "database") and emails the shop.
export async function sendPreorder(
  values: PreorderValues,
  productTitle: string,
  config: BrevoConfig,
  fetchFn: typeof fetch = fetch,
) {
  const call = brevo(config.apiKey, fetchFn);

  // Sequential: the double opt-in must find the contact already created.
  const saveContact = async () => {
    await call("/contacts", {
      email: values.email,
      attributes: { FIRSTNAME: values.name },
      listIds: [config.preorderListId],
      updateEnabled: true,
    });
    if (values.marketing) await doubleOptin(values.email, config, fetchFn);
  };

  const notifyShop = () =>
    call("/smtp/email", {
      sender: { name: `Sito ${site.name}`, email: site.ordersEmail },
      to: [{ email: site.ordersEmail }],
      replyTo: { email: values.email, name: values.name },
      subject: `Preordine ${productTitle}: ${values.quantity} da ${values.name}`,
      textContent: [
        `Nuova richiesta di preordine (senza pagamento) per ${productTitle}.`,
        "",
        `Nome: ${values.name}`,
        `Email: ${values.email}`,
        `Telefono: ${values.phone || "-"}`,
        `Quantità: ${values.quantity}`,
        `Consegna: ${values.delivery}`,
        `Note: ${values.notes || "-"}`,
        `Consenso marketing: ${values.marketing ? "sì (double opt-in inviato)" : "no"}`,
        "",
        "Rispondi a questa email per scrivere direttamente al cliente.",
      ].join("\n"),
    });

  await Promise.all([saveContact(), notifyShop()]);
}
