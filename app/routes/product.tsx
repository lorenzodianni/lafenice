import { data, redirect } from "react-router";
import { PreorderForm } from "~/components/PreorderForm";
import { ProductSection } from "~/components/ProductSection";
import { products } from "~/content/products";
import { site } from "~/content/site";
import { parsePreorder, sendPreorder } from "~/lib/preorder";
import { pageMeta } from "~/lib/seo";
import type { Route } from "./+types/product";
import styles from "./product.module.scss";

const THANKS = "/pages/grazie-preordine";

function findProduct(handle: string) {
  const product = products.find((p) => p.handle === handle);
  if (!product) throw data(null, { status: 404 });
  return product;
}

export function loader({ params }: Route.LoaderArgs) {
  return { product: findProduct(params.handle) };
}

export async function action({ request, params }: Route.ActionArgs) {
  // Imported here, not at the top: prerendering runs in Node, which cannot
  // load `cloudflare:workers`. Actions only ever run in the Worker.
  const { env } = await import("cloudflare:workers");
  const product = findProduct(params.handle);
  const { values, errors, spam } = parsePreorder(await request.formData());

  // Bots get the same answer as people, so they learn nothing.
  if (spam) return redirect(THANKS);
  if (Object.keys(errors).length > 0) {
    return data({ values, errors, formError: false }, { status: 400 });
  }

  // ponytail: lets the whole flow run in dev before the Brevo account exists.
  if (import.meta.env.DEV && !env.BREVO_API_KEY) {
    console.info("[dev] preordine non inviato, manca BREVO_API_KEY:", values);
    return redirect(THANKS);
  }

  try {
    await sendPreorder(values, product.title, {
      apiKey: env.BREVO_API_KEY ?? "",
      preorderListId: env.BREVO_PREORDER_LIST_ID,
      newsletterListId: env.BREVO_NEWSLETTER_LIST_ID,
      doiTemplateId: env.BREVO_DOI_TEMPLATE_ID,
    });
  } catch (error) {
    // Never fake success: the request would be lost. The page offers email.
    console.error("Preorder failed", error);
    return data({ values, errors: {}, formError: true }, { status: 502 });
  }
  return redirect(THANKS);
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) return [{ title: "Pagina non trovata" }];
  const { product } = loaderData;
  const path = `/products/${product.handle}`;
  const url = `${site.url}${path}`;

  return [
    ...pageMeta(
      {
        title: `${product.seo.title} | ${site.name}`,
        description: product.seo.description,
      },
      path,
    ),
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.title,
        description: product.description,
        image: `${site.url}${product.featuredImage.url}`,
        brand: { "@type": "Brand", name: site.name },
        url,
        offers: {
          "@type": "Offer",
          url,
          availability: "https://schema.org/PreOrder",
          ...(product.price && { price: product.price, priceCurrency: "EUR" }),
          seller: { "@id": `${site.url}/#business` },
        },
      },
    },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${site.url}/`,
          },
          { "@type": "ListItem", position: 2, name: product.title, item: url },
        ],
      },
    },
  ];
}

export default function Product({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { product } = loaderData;

  return (
    <main>
      <nav aria-label="Percorso" className={`wrap ${styles.crumbs}`}>
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <ProductSection product={product} heading="h1">
        <PreorderForm action={`/products/${product.handle}`} {...actionData} />
      </ProductSection>
    </main>
  );
}
