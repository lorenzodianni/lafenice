import { site } from "~/content/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (s: string) => s.length <= 254 && EMAIL.test(s);

// Where the link in Brevo's confirmation email lands.
export const CONFIRMED_PATH = "/pages/iscrizione-confermata";

export type BrevoConfig = {
  apiKey: string;
  preorderListId: number;
  newsletterListId: number;
  doiTemplateId: number;
};

// Takes env as an argument: this module also loads during prerendering (Node),
// where `cloudflare:workers` is not available.
export const brevoConfig = (env: Cloudflare.Env): BrevoConfig => ({
  apiKey: env.BREVO_API_KEY ?? "",
  preorderListId: env.BREVO_PREORDER_LIST_ID,
  newsletterListId: env.BREVO_NEWSLETTER_LIST_ID,
  doiTemplateId: env.BREVO_DOI_TEMPLATE_ID,
});

// Brevo REST API v3 via fetch, no SDK. Any non-2xx throws: callers must never
// report success for a lost request.
export function brevo(apiKey: string, fetchFn: typeof fetch = fetch) {
  return async (path: string, body: unknown) => {
    // ponytail: lets the forms run in dev before the Brevo account exists.
    if (import.meta.env.DEV && !apiKey) {
      console.info(`[dev] Brevo ${path} saltato, manca BREVO_API_KEY:`, body);
      return;
    }
    const res = await fetchFn(`https://api.brevo.com/v3${path}`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok)
      throw new Error(`Brevo ${path} ${res.status}: ${await res.text()}`);
  };
}

// Brevo emails a confirmation link and adds the address to the newsletter list
// only once it is clicked: that click is the proof of consent.
export const doubleOptin = (
  email: string,
  config: BrevoConfig,
  // Brevo attribute names, uppercase, already created in the account
  // (docs/rollout.md). Left out of the body when there are none.
  attributes?: Record<string, string>,
  fetchFn = fetch,
) =>
  brevo(config.apiKey, fetchFn)("/contacts/doubleOptinConfirmation", {
    email,
    attributes,
    includeListIds: [config.newsletterListId],
    templateId: config.doiTemplateId,
    redirectionUrl: `${site.url}${CONFIRMED_PATH}`,
  });
