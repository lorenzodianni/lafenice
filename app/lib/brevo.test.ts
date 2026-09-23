import { describe, expect, it } from "vitest";
import { emailCapReached, HOURLY_CAP, newsletterCapReached } from "./brevo";

const config = {
  apiKey: "key",
  preorderListId: 1,
  newsletterListId: 2,
};
const now = Date.parse("2026-09-24T10:00:00Z");
const answer = (json: unknown) =>
  (async () => Response.json(json)) as unknown as typeof fetch;

describe("hourly caps", () => {
  it("counts newsletter contacts touched in the last hour", async () => {
    let url = "";
    const fetchFn = (async (u: string) => {
      url = u;
      return Response.json({ contacts: Array(HOURLY_CAP - 1).fill({}) });
    }) as typeof fetch;

    expect(await newsletterCapReached(config, fetchFn, now)).toBe(false);
    expect(url).toContain("/contacts/lists/2/contacts?");
    expect(url).toContain("modifiedSince=2026-09-24T09:00:00.000Z");

    const full = answer({ contacts: Array(HOURLY_CAP).fill({}) });
    expect(await newsletterCapReached(config, full, now)).toBe(true);
  });

  it("counts only the emails sent in the last hour", async () => {
    const at = (iso: string) => ({ date: iso });
    const events = [
      ...Array(HOURLY_CAP - 1).fill(at("2026-09-24T09:30:00Z")),
      // Brevo writes dates with the account's offset: 11:59 in Rome is 09:59Z.
      at("2026-09-24T11:59:00.000+02:00"),
    ];
    expect(await emailCapReached(config, answer({ events }), now)).toBe(true);

    events[events.length - 1] = at("2026-09-24T08:59:00Z");
    expect(await emailCapReached(config, answer({ events }), now)).toBe(false);
  });
});
