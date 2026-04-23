import { VERSION } from '../hooks.server.ts';

export const ssr = true;

export const load = async ({ locals }) => {
	return {
		version: VERSION
	};
};