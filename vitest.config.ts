import { defineConfig } from "vitest/config";

// Separate from vite.config.ts: the Cloudflare plugin there would boot workerd.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { include: ["app/**/*.test.ts"] },
});
