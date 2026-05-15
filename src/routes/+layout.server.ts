import { VERSION } from '../hooks.server.ts';

export const ssr = true;

export const load = async ({ locals }) => {
	return {
		requests: locals.requests ?? -1,
		theme: locals.theme ?? 'dark',
		version: VERSION
	};
};