import { describe, expect, it } from "vitest";
import { site } from "~/content/site";
import { CONFIRMED_PATH, doubleOptin } from "./brevo";
import { parseNewsletter } from "./newsletter";

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

describe("parseNewsletter", () => {
  it("accepts an email with consent", () => {
    const { values, errors, spam } = parseNewsletter(
      form({ email: " maria@example.it ", consent: "on" }),
    );
    expect(errors).toEqual({});
    expect(spam).toBe(false);
    expect(values.email).toBe("maria@example.it");
  });

  it("requires a valid email and consent, and flags the honeypot", () => {
    const { errors, spam } = parseNewsletter(
      form({ email: "nope", website: "x" }),
    );
    expect(Object.keys(errors).sort()).toEqual(["consent", "email"]);
    expect(spam).toBe(true);
  });
});

describe("doubleOptin", () => {
  it("asks Brevo to confirm into the newsletter list, back to our page", async () => {
    let body: Record<string, unknown> = {};
    const fetchFn = (async (url: string, init: RequestInit) => {
      expect(url).toBe(
        "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
      );
      body = JSON.parse(String(init.body));
      return new Response(null, { status: 201 });
    }) as typeof fetch;

    const config = {
      apiKey: "key",
      preorderListId: 1,
      newsletterListId: 2,
      doiTemplateId: 3,
    };
    await doubleOptin("maria@example.it", config, fetchFn);

    expect(body).toEqual({
      email: "maria@example.it",
      includeListIds: [2],
      templateId: 3,
      redirectionUrl: `${site.url}${CONFIRMED_PATH}`,
    });
  });
});
