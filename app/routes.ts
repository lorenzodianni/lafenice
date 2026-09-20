import { index, type RouteConfig, route } from "@react-router/dev/routes";

// Shopify URL conventions (see CLAUDE.md), so a migration needs no redirects.
export default [
  index("routes/home.tsx"),
  route("products/:handle", "routes/product.tsx"),
  route("pages/grazie-preordine", "routes/preorder-thanks.tsx"),
  route("pages/newsletter", "routes/newsletter.tsx"),
  route("pages/grazie-newsletter", "routes/newsletter-thanks.tsx"),
  route("pages/iscrizione-confermata", "routes/newsletter-confirmed.tsx"),
  route("policies/privacy-policy", "routes/privacy.tsx"),
  route("policies/terms-of-service", "routes/terms.tsx"),
  // Resource routes: a loader, no component. Prerendered to files with
  // these exact names (build/client/sitemap.xml and so on).
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  route("llms.txt", "routes/llms.ts"),
] satisfies RouteConfig;
