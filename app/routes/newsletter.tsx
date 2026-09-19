import { data, redirect } from "react-router";
import { NewsletterForm } from "~/components/NewsletterForm";
import { site } from "~/content/site";
import { brevoConfig, doubleOptin } from "~/lib/brevo";
import { parseNewsletter } from "~/lib/newsletter";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/newsletter";

const THANKS = "/pages/grazie-newsletter";

// Every newsletter form posts here, so this path is served by the Worker
// (run_worker_first in wrangler.jsonc), not by static assets.
export async function action({ request }: Route.ActionArgs) {
  // See product.tsx: `cloudflare:workers` only loads inside the Worker.
  const { env } = await import("cloudflare:workers");
  const { values, errors, spam } = parseNewsletter(await request.formData());

  if (spam) return redirect(THANKS);
  if (Object.keys(errors).length > 0) {
    return data({ values, errors, formError: false }, { status: 400 });
  }

  try {
    await doubleOptin(values.email, brevoConfig(env));
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return data({ values, errors: {}, formError: true }, { status: 502 });
  }
  return redirect(THANKS);
}

export function meta(_: Route.MetaArgs) {
  return pageMeta(
    {
      title: `Newsletter | ${site.name}`,
      description: `Iscriviti alla newsletter del ${site.kind} ${site.name} di ${site.address.city}: promozioni, nuovi trattamenti e il lancio del Detergente Rinascita.`,
    },
    "/pages/newsletter",
  );
}

export default function Newsletter({ actionData }: Route.ComponentProps) {
  return (
    <main className="wrap section">
      <p className="eyebrow">Newsletter</p>
      <h1>Iscriviti alla newsletter</h1>
      <NewsletterForm {...actionData} />
    </main>
  );
}
