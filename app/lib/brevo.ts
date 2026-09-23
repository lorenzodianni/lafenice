const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (s: string) => s.length <= 254 && EMAIL.test(s);

export type BrevoConfig = {
  apiKey: string;
  preorderListId: number;
  newsletterListId: number;
};

// Takes env as an argument: this module also loads during prerendering (Node),
// where `cloudflare:workers` is not available.
export const brevoConfig = (env: Cloudflare.Env): BrevoConfig => ({
  apiKey: env.BREVO_API_KEY ?? "",
  preorderListId: env.BREVO_PREORDER_LIST_ID,
  newsletterListId: env.BREVO_NEWSLETTER_LIST_ID,
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
// No confirmation email anywhere (the client's choice, see CLAUDE.md). An
// address that unsubscribed stays so: updateEnabled does not lift Brevo's
// blacklist, and without a confirmation email nobody proves a new signup.
export const upsertContact = (
  email: string,
  listIds: number[],
  config: BrevoConfig,
  // Brevo attribute IDs, uppercase, which must exist in the account
  // (docs/rollout.md). Left out of the body when there are none.
  attributes?: Record<string, string>,
  fetchFn = fetch,
) =>
  brevo(config.apiKey, fetchFn)("/contacts", {
    email,
    attributes,
    listIds,
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

// Every preorder emails the shop, and the same address twice is still two
// emails: what piles up is sends. Also the guard on the daily Brevo quota the
// shop notifications depend on.
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
