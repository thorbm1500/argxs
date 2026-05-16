import type { PageServerLoad } from './$types';
import { SiteCookies } from '$lib/server/Definitions';
import type { SEO } from '$lib/components/interfaces';

export const ssr = true;

export const load: PageServerLoad = async ({cookies}) => {
	return {
		seo: {
			title: 'argxs ▪ Web Resources'
		} as SEO,
		optedOut: cookies.get(SiteCookies.OptOut)
	};
};