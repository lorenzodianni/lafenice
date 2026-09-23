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
// report success for a lost request. With a body it POSTs, without it GETs and
// returns the JSON.
export function brevo(apiKey: string, fetchFn: typeof fetch = fetch) {
  return async (path: string, body?: unknown): Promise<unknown> => {
    // ponytail: lets the forms run in dev before the Brevo account exists.
    if (import.meta.env.DEV && !apiKey) {
      console.info(`[dev] Brevo ${path} saltato, manca BREVO_API_KEY:`, body);
      return;
    }
    const res = await fetchFn(`https://api.brevo.com/v3${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok)
      throw new Error(`Brevo ${path} ${res.status}: ${await res.text()}`);
    if (body === undefined) return res.json();
  };
}

// Creates the contact or updates it in place: a second signup is not an error.
// An address that unsubscribed stays so: updateEnabled does not lift Brevo's
// blacklist, and without a confirmation email nobody proves a new signup.
export const upsertContact = (
  email: string,
  listId: number,
  config: BrevoConfig,
  attributes?: Record<string, string>,
  fetchFn = fetch,
) =>
  brevo(config.apiKey, fetchFn)("/contacts", {
    email,
    attributes,
    listIds: [listId],
    updateEnabled: true,
  });

// Anti-abuse cap on both forms, counted on Brevo itself: no store of our own.
// It asks for at most HOURLY_CAP rows, so it never relies on Brevo's totals.
// ponytail: check then send, so simultaneous requests can slip past together,
// and Brevo's log may trail a burst by a few seconds. The per-IP Cloudflare
// rule (docs/rollout.md §7) covers bursts from a single source.
export const HOURLY_CAP = 30;
const HOUR = 3_600_000;

// Newsletter signups send no email: what piles up is contacts in the list.
export async function newsletterCapReached(
  config: BrevoConfig,
  fetchFn = fetch,
  now = Date.now(),
) {
  const since = new Date(now - HOUR).toISOString();
  const page = (await brevo(
    config.apiKey,
    fetchFn,
  )(
    `/contacts/lists/${config.newsletterListId}/contacts?modifiedSince=${since}&limit=${HOURLY_CAP}`,
  )) as { contacts?: unknown[] } | undefined;
  return (page?.contacts?.length ?? 0) >= HOURLY_CAP;
}

// Preorders send email (the shop notification, maybe a double opt-in), and the
// same address twice is still two emails: what piles up is sends. Also the
// guard on the daily Brevo quota the shop notifications depend on.
export async function emailCapReached(
  config: BrevoConfig,
  fetchFn = fetch,
  now = Date.now(),
) {
  // days=2: today alone would forget the hour before midnight.
  const page = (await brevo(
    config.apiKey,
    fetchFn,
  )(
    `/smtp/statistics/events?event=requests&days=2&sort=desc&limit=${HOURLY_CAP}`,
  )) as { events?: { date: string }[] } | undefined;
  const recent = (page?.events ?? []).filter(
    (e) => now - Date.parse(e.date) < HOUR,
  );
  return recent.length >= HOURLY_CAP;
}

// Brevo emails a confirmation link and adds the address to the newsletter list
// only once it is clicked: that click is the proof of consent. Used for the
// marketing consent in the preorder form; the newsletter form subscribes
// directly (the client's choice, see CLAUDE.md).
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
