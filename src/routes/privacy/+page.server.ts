import type { PageServerLoad } from './$types';
import { SiteCookies } from '$lib/server/Definitions';

export const ssr = true;

export const load: PageServerLoad = async ({cookies}) => {
	return {
		optedOut: cookies.get(SiteCookies.OptOut)
	};
};