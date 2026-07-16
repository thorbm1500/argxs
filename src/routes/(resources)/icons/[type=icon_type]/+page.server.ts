import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';
import type { SEO } from '$lib/components/interfaces';

export const ssr = false;

export const load: PageServerLoad = async ({ params }) => {
	if (!params.type) console.error('params.type undefined!');
	if (!RESOURCES) console.error('RESOURCES undefined!');

	if (params.type === 'brands') {
		return {
			seo: {
				title: 'argxs ▪ Brand Icons',
				description: `Browse a total of ${RESOURCES.BRAND_TOTAL_AMOUNT} different brand icons & logos, consisting of ${RESOURCES.BRAND_ICON_AMOUNT} icons, and ${RESOURCES.BRAND_LOGO_AMOUNT} logos. This collection currently consists of ${RESOURCES.BRAND_AMOUNT} different brands, frameworks, programming languages & more.`
			} as SEO,
			icons: RESOURCES.BRAND_ICONS,
			iconsSortedNew: RESOURCES.BRAND_ICONS_SORTED_NEW,
			iconsSortedAtoZ: RESOURCES.BRAND_ICONS_SORTED_AtoZ,
			iconTags: RESOURCES.BRAND_ALL_TAGS,
			iconAmount: RESOURCES.BRAND_ICON_AMOUNT,
			logoAmount: RESOURCES.BRAND_LOGO_AMOUNT,
			totalAmount: RESOURCES.BRAND_TOTAL_AMOUNT,
			entryAmount: RESOURCES.BRAND_AMOUNT
		};
	} else {
		return {
			seo: {
				title: 'argxs ▪ Flag Icons',
				description: `Browse a total of ${RESOURCES.FLAG_TOTAL_AMOUNT} different countries*, consisting of ${RESOURCES.FLAG_ICON_AMOUNT} different flags. * This includes all 193 member states and 2 general observers of the United Nations, as well as de facto states, and other famous flags.`
			} as SEO,
			icons: RESOURCES.FLAG_ICONS,
			iconsSortedNew: RESOURCES.FLAG_ICONS_SORTED_NEW,
			iconsSortedAtoZ: RESOURCES.FLAG_ICONS_SORTED_AtoZ,
			iconTags: RESOURCES.FLAG_ALL_TAGS,
			iconAmount: 0,
			logoAmount: 0,
			totalAmount: RESOURCES.FLAG_ICON_AMOUNT,
			entryAmount: RESOURCES.FLAG_TOTAL_AMOUNT
		};
	}
};