import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "svelte-adapter-bun";

// @ts-ignore
export default defineConfig({
  lint: {
    ignorePatterns: ["**.d.ts", "static", "src/lib/resources", "src/lib/fonts", "src/lib/server/resources"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    globals: {
      "Navigator": "off"
    },
    env: {
      "builtin": true,
      "browser": true,
      "svelte": true
    },
    rules: {
      "no-unused-vars": ["error", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^ignored"
      }]
    }
  },
  plugins: [
    // @ts-ignore
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess({ script: true }),
      adapter: adapter({
        precompress: false,
      }),
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes("node_modules") ? undefined : true,
        experimental: {
          async: true,
        },
      },
      output: {
        preloadStrategy: "modulepreload",
      },
      prerender: {
        handleHttpError: "warn",
        concurrency: 2,
      },
      experimental: {
        remoteFunctions: true,
      },
      csp: {
        directives: {
          "script-src": ["self","unsafe-inline","https://cdn.argxs.dev","https://static.cloudflareinsights.com"],
          "connect-src": ["self","unsafe-inline","https://cdn.argxs.dev","https://static.cloudflareinsights.com"],
          "style-src": ["self","unsafe-inline","https://cdn.argxs.dev"],
          "img-src": ["self","unsafe-inline","https://cdn.argxs.dev"],
        },
      },
      csrf: {
        trustedOrigins: ["https://argxs.dev", "https://dev.argxs.dev"],
      },
      version: {
        name: "0.9.0",
        pollInterval: 120000,
      },
    }),
  ],
});