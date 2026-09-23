import { data, redirect } from "react-router";
import { NewsletterForm, newsletterPitch } from "~/components/NewsletterForm";
import { products } from "~/content/products";
import { site } from "~/content/site";
import { brevoConfig, newsletterCapReached } from "~/lib/brevo";
import { parseNewsletter, sendNewsletter } from "~/lib/newsletter";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/newsletter";

const THANKS = "/pages/grazie-newsletter";

export const handle = { hideNewsletter: true };

// Every newsletter form posts here, so this path is served by the Worker
// (run_worker_first in wrangler.jsonc), not by static assets.
export async function action({ request }: Route.ActionArgs) {
  // See product.tsx: `cloudflare:workers` only loads inside the Worker.
  const { env } = await import("cloudflare:workers");
  // Non-form bodies (bots) get the validation errors, not a 500.
  const form = await request.formData().catch(() => new FormData());
  const { values, errors, spam } = parseNewsletter(form);

  if (spam) return redirect(THANKS);
  if (Object.keys(errors).length > 0) {
    return data({ values, errors, formError: false }, { status: 400 });
  }

  const config = brevoConfig(env);
  try {
    // Over the cap the form says "riprova tra poco", like any failure. A
    // failed count throws into the catch: without it, nothing is subscribed.
    if (await newsletterCapReached(config)) {
      console.warn("Newsletter hourly cap reached");
      return data({ values, errors: {}, formError: true }, { status: 429 });
    }
    await sendNewsletter(values, config);
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return data({ values, errors: {}, formError: true }, { status: 502 });
  }
  return redirect(THANKS);
}

export function meta() {
  return pageMeta(
    {
      title: `Newsletter | ${site.name}`,
      description: `Iscriviti alla newsletter del ${site.kind} ${site.name} di ${site.address.city}: promozioni, nuovi trattamenti e il lancio del ${products[0].title}.`,
    },
    "/pages/newsletter",
  );
}

export default function Newsletter({ actionData }: Route.ComponentProps) {
  return (
    <main className="wrap section">
      <p className="eyebrow">Newsletter</p>
      <h1>Iscriviti alla newsletter</h1>
      <p>{newsletterPitch}</p>
      <NewsletterForm {...actionData} />
    </main>
  );
}
