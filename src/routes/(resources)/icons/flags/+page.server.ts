import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';

export const ssr = true;

export const load: PageServerLoad = async () => {
	return {
		flags: RESOURCES.FLAG_ICONS,
		iconAmount: RESOURCES.FLAG_ICON_AMOUNT
	};
};