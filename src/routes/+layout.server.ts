import { VERSION } from '../hooks.server.ts';

export const prerender = true;

export const load = async ({locals}) => {
	return {
		theme: locals.theme,
		version: VERSION
	}
}