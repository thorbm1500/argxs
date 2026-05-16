import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../hooks.server.ts';
import type { SEO } from '$lib/components/interfaces';

export const ssr = false;

export const load: PageServerLoad = async () => {
	return {
		seo: {
			title: 'argxs ▪ Changelogs'
		} as SEO,
		changelogs: RESOURCES.CHANGELOGS
	};
};