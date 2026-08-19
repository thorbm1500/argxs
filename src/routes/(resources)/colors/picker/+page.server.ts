import type { PageServerLoad } from './$types';
import { type SEO } from '$lib/components/interfaces';
import { getDefaultSEODescription } from '$lib/server/internalInterfaces';

export const ssr = true;

export const load: PageServerLoad = async ({ locals }) => {
	return {
		theme: locals.theme ?? 'dark',
		seo: {
			title: 'argxs ▪ ',
			description: getDefaultSEODescription()
		} as SEO
	};
};