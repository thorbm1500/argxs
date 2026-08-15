import type { PageServerLoad } from './$types';
import { getDefaultSEODescription, type SEO } from '$lib/components/interfaces';

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