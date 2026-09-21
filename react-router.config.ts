import type { Config } from "@react-router/dev/config";
import { products } from "./app/content/products";

export default {
  // ssr must stay true: form actions run in the Worker.
  ssr: true,
  // Every static path, plus the product pages. On Cloudflare those are in
  // run_worker_first (wrangler.jsonc), so the Worker answers and their HTML
  // is never served: it exists for the static GitHub Pages preview.
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
