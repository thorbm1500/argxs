import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';
import type { SEO } from '$lib/components/interfaces';

export const ssr = true;

export const load: PageServerLoad = async ({ params }) => {
	if (!params.type) console.error('params.type undefined!');
	if (!RESOURCES) console.error('RESOURCES undefined!');

	if (params.type === 'brands') {
		return {
			seo: {
				title: 'argxs ▪ Brand Icons'
			} as SEO,
			icons: RESOURCES.BRAND_ICONS,
			iconsSortedNew: RESOURCES.BRAND_ICONS_SORTED_NEW,
			iconsSortedAtoZ: RESOURCES.BRAND_ICONS_SORTED_AtoZ,
			iconAmount: RESOURCES.BRAND_ICON_AMOUNT,
			logoAmount: RESOURCES.BRAND_LOGO_AMOUNT,
			totalAmount: RESOURCES.BRAND_TOTAL_AMOUNT
		};
	} else {
		return {
			seo: {
				title: 'argxs ▪ Flag Icons'
			} as SEO,
			icons: RESOURCES.FLAG_ICONS,
			iconsSortedNew: RESOURCES.FLAG_ICONS_SORTED_NEW,
			iconsSortedAtoZ: RESOURCES.FLAG_ICONS_SORTED_AtoZ,
			iconAmount: RESOURCES.FLAG_ICON_AMOUNT,
			logoAmount: 0,
			totalAmount: RESOURCES.FLAG_TOTAL_AMOUNT
		};
	}
};