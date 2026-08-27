import type { PageServerLoad } from './$types';
import { type SEO } from '$lib/components/interfaces';
import { getDefaultSEODescription } from '$lib/server/internalInterfaces';

export const ssr = true;

export const load: PageServerLoad = async () => {
	return {
		seo: {
			title: 'argxs ▪ Gradients | Web Development Resources',
			description: getDefaultSEODescription()
		} as SEO
	};
};