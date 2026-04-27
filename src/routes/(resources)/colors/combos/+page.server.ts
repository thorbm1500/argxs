import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';

export const ssr = true;

export const load: PageServerLoad = async () => {
	return {
		combos: RESOURCES.COLOR_COMBOS,
		comboAmount: RESOURCES.COLOR_COMBO_AMOUNT
	};
};