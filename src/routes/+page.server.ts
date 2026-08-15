import { VERSION } from '../hooks.server.ts';
import { getDefaultSEODescription, getDefaultSEOTitle, type SEO } from '$lib/components/interfaces';

export const ssr = true;

export const load = async () => {
	return {
		seo: {
			title: getDefaultSEOTitle(),
			description: getDefaultSEODescription()
		} as SEO,
		version: VERSION
	};
};