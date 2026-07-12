import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from 'svelte-adapter-bun';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit({
		preprocess: vitePreprocess(),
		adapter: adapter({
			precompress: false
		}),
		compilerOptions: {
			// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
			runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
			experimental: {
				async: true
			}
		},
		output: {
			preloadStrategy: 'modulepreload'
		},
		prerender: {
			handleHttpError: 'warn',
			concurrency: 2
		},
		experimental: {
			remoteFunctions: true
		},
		csp: {
			directives: {
				'script-src': ['self']
			}
		},
		csrf: {
			trustedOrigins: ['https://argxs.com','https://dev.argxs.com']
		},
		version: {
			name: '0.7.3',
			pollInterval: 120000
		}
	})]
});