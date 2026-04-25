import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';

export const ssr = true;

export const load: PageServerLoad = async () => {
	return {
		brands: RESOURCES.BRAND_ICONS,
		iconAmount: RESOURCES.BRAND_ICON_AMOUNT
	};
};