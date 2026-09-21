import type { Config } from "@react-router/dev/config";
import { products } from "./app/content/products";

export default {
  // ssr must stay true: form actions run in the Worker.
  ssr: true,
  // Every static path, product pages included: their content is static too
  // (products.ts). On Cloudflare /products/* goes to the Worker first
  // (run_worker_first, wrangler.jsonc), which renders it anyway; the HTML is
  // for static hosts such as the GitHub Pages preview.
  prerender: ({ getStaticPaths }) => [
    ...getStaticPaths(),
    ...products.map((p) => `/products/${p.handle}`),
  ],
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
