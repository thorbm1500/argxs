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
			name: '0.2.15'
		},
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		experimental: {
			remoteFunctions: true
		},
		adapter: adapter({
			precompress: false
		}),
		prerender: {
			handleHttpError: 'warn'
		}
	}
};

export default config;