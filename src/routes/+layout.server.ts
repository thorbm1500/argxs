import { VERSION } from '../hooks.server.ts';

export const ssr = true;

export const load = async ({ locals }) => {
	return {
		requests: locals.requests,
		theme: locals.theme,
		version: VERSION
	};
};