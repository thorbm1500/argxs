import { VERSION } from '../hooks.server.ts';

export const prerender = true;

export const load = async () => {
	return {
		version: VERSION
	}
}