import { products } from "~/content/products";
import { site } from "~/content/site";

// Only the indexable pages: the thank-you pages are `noindex` (see seo.ts), so
// listing them would send crawlers where we ask them not to look.
const paths = [
  "/",
  ...products.map((p) => `/products/${p.handle}`),
  "/pages/newsletter",
  "/policies/privacy-policy",
];

// No <lastmod>: the only date we have is the build date, which says nothing
// about when the content changed.
export function loader() {
  const urls = paths
    .map((path) => `  <url><loc>${site.url}${path}</loc></url>`)
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "content-type": "application/xml; charset=utf-8" } },
  );
}
