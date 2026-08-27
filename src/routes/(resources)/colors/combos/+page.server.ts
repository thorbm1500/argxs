import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';
import { type SEO } from '$lib/components/interfaces';
import { getDefaultSEODescription } from '$lib/server/internalInterfaces';

export const ssr = true;

export const load: PageServerLoad = async () => {
	return {
		seo: {
			title: 'argxs ▪ Color Combos | Web Development Resources',
			description: getDefaultSEODescription()
		} as SEO,
		combos: RESOURCES.COLOR_COMBOS,
		comboAmount: RESOURCES.COLOR_COMBO_AMOUNT
	};
};