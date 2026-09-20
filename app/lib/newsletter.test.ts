import { describe, expect, it } from "vitest";
import { site } from "~/content/site";
import { CONFIRMED_PATH, doubleOptin } from "./brevo";
import { parseNewsletter, sendNewsletter } from "./newsletter";

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

  it("takes a birthday only if it is a real past date", () => {
    const ok = parseNewsletter(
      form({
        email: "maria@example.it",
        consent: "on",
        birthday: "1985-02-28",
      }),
    );
    expect(ok.errors).toEqual({});
    expect(ok.values.birthday).toBe("1985-02-28");

    for (const birthday of ["1985-02-31", "28/02/1985", "2999-01-01"]) {
      const { errors } = parseNewsletter(
        form({ email: "maria@example.it", consent: "on", birthday }),
      );
      expect(errors.birthday).toBeDefined();
    }
  });

  it("requires a valid email and consent, and flags the honeypot", () => {
    const { errors, spam } = parseNewsletter(
      form({ email: "nope", website: "x" }),
    );
    expect(Object.keys(errors).sort()).toEqual(["consent", "email"]);
    expect(spam).toBe(true);
  });
});

describe("sendNewsletter", () => {
  const config = {
    apiKey: "key",
    preorderListId: 1,
    newsletterListId: 2,
    doiTemplateId: 3,
  };

  it("subscribes anyway when Brevo refuses the birthday", async () => {
    const bodies: Record<string, unknown>[] = [];
    // A Brevo account without the BIRTHDAY attribute answers exactly like this.
    const fetchFn = (async (_url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      bodies.push(body);
      return body.attributes
        ? new Response("unknown attribute", { status: 400 })
        : new Response(null, { status: 201 });
    }) as typeof fetch;

    await sendNewsletter(
      { email: "maria@example.it", consent: true, birthday: "1985-02-28" },
      config,
      fetchFn,
    );

    expect(bodies).toHaveLength(2);
    expect(bodies[1].attributes).toBeUndefined();
  });

  it("fails when the subscription itself fails", async () => {
    const fetchFn = (async () =>
      new Response("down", { status: 500 })) as typeof fetch;

    await expect(
      sendNewsletter(
        { email: "maria@example.it", consent: true, birthday: "" },
        config,
        fetchFn,
      ),
    ).rejects.toThrow();
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
    await doubleOptin("maria@example.it", config, undefined, fetchFn);

    expect(body).toEqual({
      email: "maria@example.it",
      includeListIds: [2],
      templateId: 3,
      redirectionUrl: `${site.url}${CONFIRMED_PATH}`,
    });

    await doubleOptin(
      "maria@example.it",
      config,
      { BIRTHDAY: "1985-02-28" },
      fetchFn,
    );
    expect(body.attributes).toEqual({ BIRTHDAY: "1985-02-28" });
  });
});
