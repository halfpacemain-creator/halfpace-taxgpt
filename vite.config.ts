// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Netlify preset is auto-selected when building on Netlify (via NITRO_PRESET=netlify
// which Netlify sets, or via the netlify.toml build env). We also set it explicitly
// here so `npm run build` outside Lovable always produces a Netlify-ready bundle.
const isLovableBuild = !!process.env.LOVABLE_BUILD;
const nitroPreset = process.env.NITRO_PRESET || "netlify";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: isLovableBuild
    ? undefined
    : {
        preset: nitroPreset,
      },
});
