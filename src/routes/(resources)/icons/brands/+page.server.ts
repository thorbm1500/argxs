import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';

export const load: PageServerLoad = async () => {
	return {
		brands: RESOURCES.BRAND_ICONS
	};
};
