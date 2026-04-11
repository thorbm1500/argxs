import { error, type Handle } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';

const limiter = new RateLimiter({ IP: [3, 's'] });

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	if (await limiter.isLimited(event)) return error(429);
	return resolve(event);
};