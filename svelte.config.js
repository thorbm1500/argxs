import adapter from 'svelte-adapter-bun';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	onwarn: (warning, defaultHandler) => {
		if (!warning.message.includes('https://svelte.dev/e/css_unused_selector')) {
			defaultHandler(warning);
		}
	},
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true),
		experimental: {
			async: true
		}
	},
	kit: {
		version: {
			name: '0.7.0',
			pollInterval: 300000
		},
		experimental: {
			remoteFunctions: true
		},
		adapter: adapter({
			precompress: false
		}),
		prerender: {
			handleHttpError: 'warn',
			concurrency: 2
		}
	},
	trustedOrigins: ['https://argxs.com','https://dev.argxs.com']
};

export default config;