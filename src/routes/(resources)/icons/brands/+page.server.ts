import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';

export const ssr = true;

export const load: PageServerLoad = async () => {
	return {
		icons: RESOURCES.BRAND_ICONS,
		iconsSortedNew: RESOURCES.BRAND_ICONS_SORTED_NEW,
		iconsSortedAtoZ: RESOURCES.BRAND_ICONS_SORTED_AtoZ,
		iconAmount: RESOURCES.BRAND_ICON_AMOUNT,
		logoAmount: RESOURCES.BRAND_LOGO_AMOUNT,
		totalAmount: RESOURCES.BRAND_TOTAL_AMOUNT
	};
};