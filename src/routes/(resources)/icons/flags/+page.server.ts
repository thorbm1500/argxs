import type { PageServerLoad } from './$types';
import { RESOURCES } from '../../../../hooks.server.ts';

export const load: PageServerLoad = async () => {
	return {
		flags: RESOURCES.FLAG_ICONS
	};
};
