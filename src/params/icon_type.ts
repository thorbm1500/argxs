import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is ('brands' | 'flags') => {
	return param === 'brands' || param === 'flags';
}) satisfies ParamMatcher;