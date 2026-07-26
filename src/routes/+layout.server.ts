import { VERSION } from '../hooks.server.ts';
import type { LayoutServerLoad } from '../../.svelte-kit/types/src/routes/$types';

export const ssr = true;

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		requests: locals.requests ?? -1,
		theme: locals.theme ?? 'dark',
		version: VERSION
	};
};