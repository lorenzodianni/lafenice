import { site } from "~/content/site";

export const quantities = ["1", "2", "3", "4", "5 o più"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[+\d\s().-]*$/;

export type PreorderValues = {
  name: string;
  email: string;
  phone: string;
  quantity: string;
  notes: string;
  marketing: boolean;
};
export type PreorderErrors = Partial<
  Record<Exclude<keyof PreorderValues, "marketing"> | "privacy", string>
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
    notes: text("notes"),
    marketing: form.get("marketing") === "on",
  };

  const errors: PreorderErrors = {};
  if (!values.name || values.name.length > 100)
    errors.name = "Inserisci nome e cognome.";
  if (!EMAIL.test(values.email) || values.email.length > 254)
    errors.email = "Inserisci un indirizzo email valido.";
  if (values.phone.length > 30 || !PHONE.test(values.phone))
    errors.phone = "Inserisci un numero di telefono valido.";
  if (!quantities.includes(values.quantity))
    errors.quantity = "Scegli una quantità.";
  if (values.notes.length > 1000) errors.notes = "Massimo 1000 caratteri.";
  if (form.get("privacy") !== "on")
    errors.privacy = "Conferma di aver letto l'informativa privacy.";

  // Honeypot: hidden from people, bots fill it in.
  const spam = text("website") !== "";

  return { values, errors, spam };
}

export type BrevoConfig = {
  apiKey: string;
  preorderListId: number;
  newsletterListId: number;
  doiTemplateId: number;
};

// Brevo stores the contact (our only "database") and emails the shop.
export async function sendPreorder(
  values: PreorderValues,
  productTitle: string,
  config: BrevoConfig,
  fetchFn: typeof fetch = fetch,
) {
  const call = async (path: string, body: unknown) => {
    const res = await fetchFn(`https://api.brevo.com/v3${path}`, {
      method: "POST",
      headers: {
        "api-key": config.apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok)
      throw new Error(`Brevo ${path} ${res.status}: ${await res.text()}`);
  };

  // Sequential: the double opt-in must find the contact already created.
  const saveContact = async () => {
    await call("/contacts", {
      email: values.email,
      attributes: { FIRSTNAME: values.name },
      listIds: [config.preorderListId],
      updateEnabled: true,
    });
    if (values.marketing) {
      await call("/contacts/doubleOptinConfirmation", {
        email: values.email,
        includeListIds: [config.newsletterListId],
        templateId: config.doiTemplateId,
        redirectionUrl: `${site.url}/`,
      });
    }
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
        `Note: ${values.notes || "-"}`,
        `Consenso marketing: ${values.marketing ? "sì (double opt-in inviato)" : "no"}`,
        "",
        "Rispondi a questa email per scrivere direttamente al cliente.",
      ].join("\n"),
    });

  await Promise.all([saveContact(), notifyShop()]);
}
