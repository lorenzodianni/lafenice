import type { Config } from "@react-router/dev/config";

export default {
  // ssr must stay true: form actions run in the Worker.
  ssr: true,
  // Prerenders every static path. Dynamic routes (e.g. /products/:handle)
  // must list their paths here via the function form.
  prerender: true,
  future: {
    v8_middleware: true,
    v8_passThroughRequests: true,
    v8_splitRouteModules: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
