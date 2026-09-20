import { describe, expect, it } from "vitest";
import { site } from "~/content/site";
import { parsePreorder, sendPreorder } from "./preorder";

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

const valid = {
  name: " Maria \n Rossi ",
  email: "maria@example.it",
  phone: "+39 333 123 4567",
  quantity: "2",
  delivery: "Spedizione a casa",
  address: "Via Roma 1\n20092 Cinisello Balsamo (MI)",
  notes: "Citofono Rossi",
  privacy: "on",
  marketing: "on",
};

const config = {
  apiKey: "key",
  preorderListId: 1,
  newsletterListId: 2,
  doiTemplateId: 3,
};

describe("parsePreorder", () => {
  it("accepts a valid request and normalizes single-line fields", () => {
    const { values, errors, spam } = parsePreorder(form(valid));
    expect(errors).toEqual({});
    expect(spam).toBe(false);
    expect(values.name).toBe("Maria Rossi");
    expect(values.marketing).toBe(true);
  });

  it("wants the address only when the order is shipped", () => {
    const shipped = parsePreorder(form({ ...valid, address: "" }));
    expect(shipped.errors.address).toBeDefined();

    // Typed, then the choice changed: the form hides it, the shop never sees it.
    const pickup = parsePreorder(
      form({ ...valid, delivery: "Ritiro in negozio" }),
    );
    expect(pickup.errors).toEqual({});
    expect(pickup.values.address).toBe("");
  });

  it("rejects missing or malformed fields and flags the honeypot", () => {
    const { errors, spam } = parsePreorder(
      form({ email: "nope", phone: "abc", quantity: "99", website: "x" }),
    );
    expect(Object.keys(errors).sort()).toEqual(
      ["delivery", "email", "name", "phone", "privacy", "quantity"].sort(),
    );
    expect(spam).toBe(true);
  });
});

describe("sendPreorder", () => {
  it("saves the contact, then the double opt-in, and emails the shop", async () => {
    const calls: { path: string; body: Record<string, unknown> }[] = [];
    const fetchFn = (async (url: string, init: RequestInit) => {
      calls.push({
        path: url.replace("https://api.brevo.com/v3", ""),
        body: JSON.parse(String(init.body)),
      });
      return new Response(null, { status: 201 });
    }) as typeof fetch;

    const { values } = parsePreorder(form(valid));
    await sendPreorder(values, "Detergente", config, fetchFn);

    const paths = calls.map((c) => c.path);
    expect(paths).toHaveLength(3);
    expect(paths.indexOf("/contacts")).toBeLessThan(
      paths.indexOf("/contacts/doubleOptinConfirmation"),
    );
    const mail = calls.find((c) => c.path === "/smtp/email")?.body;
    expect(mail?.textContent).toContain("Consegna: Spedizione a casa");
    expect(mail?.textContent).toContain("Indirizzo: Via Roma 1");
    expect(mail?.to).toEqual([{ email: site.ordersEmail }]);
    expect(mail?.replyTo).toEqual({ email: valid.email, name: "Maria Rossi" });
  });

  it("skips the double opt-in without consent and fails on Brevo errors", async () => {
    const paths: string[] = [];
    const fetchFn = (async (url: string) => {
      paths.push(url);
      return new Response("bad", { status: 400 });
    }) as typeof fetch;

    const { values } = parsePreorder(form({ ...valid, marketing: "" }));
    await expect(
      sendPreorder(values, "Detergente", config, fetchFn),
    ).rejects.toThrow(/Brevo .* 400/);
    expect(paths.some((p) => p.includes("doubleOptin"))).toBe(false);
  });
});
