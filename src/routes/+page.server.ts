import { VERSION } from '../hooks.server.ts';
import type { SEO } from '$lib/components/interfaces';

export const ssr = true;

export const load = async () => {
	return {
		seo: {
			title: 'argxs ▪ Web Resources'
		} as SEO,
		version: VERSION
	};
};