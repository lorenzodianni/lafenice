import type { Config } from "@react-router/dev/config";

export default {
  // ssr must stay true: form actions run in the Worker.
  ssr: true,
  // Every static path (dynamic ones like /products/:handle are rendered by the
  // Worker). Paths that receive a POST are in run_worker_first (wrangler.jsonc).
  prerender: true,
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
