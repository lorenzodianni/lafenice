import type { Config } from "@react-router/dev/config";

export default {
  // ssr must stay true: form actions run in the Worker.
  ssr: true,
  // Every static path. Product pages are not prerendered: they carry the
  // preorder form, so wrangler.jsonc routes them to the Worker (run_worker_first).
  prerender: true,
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
