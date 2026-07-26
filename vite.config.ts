import { defineConfig } from "vite-plus";
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "svelte-adapter-bun";

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
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
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
          "script-src": ["self"],
        },
      },
      csrf: {
        trustedOrigins: ["https://argxs.com", "https://dev.argxs.com"],
      },
      version: {
        name: "0.8.0",
        pollInterval: 120000,
      },
    }),
  ],
});