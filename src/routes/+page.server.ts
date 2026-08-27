import { VERSION } from '../hooks.server.ts';
import { type SEO } from '$lib/components/interfaces';
import { getDefaultSEODescription, getDefaultSEOTitle } from '$lib/server/internalInterfaces';

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