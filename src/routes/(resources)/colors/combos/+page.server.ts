import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';
import type { SEO } from '$lib/components/interfaces';

export const ssr = true;

export const load: PageServerLoad = async () => {
	return {
		seo: {
			title: 'argxs ▪ Color Combos | Web Development Resources'
		} as SEO,
		combos: RESOURCES.COLOR_COMBOS,
		comboAmount: RESOURCES.COLOR_COMBO_AMOUNT
	};
};