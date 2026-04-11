import { building } from '$app/environment';
import { error, type Handle } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { Resources } from '$lib/server/Resources';

const limiter = new RateLimiter({ IP: [3, 's'] });

export const RESOURCES: Resources = new Resources();

export const load = async () => {
	await RESOURCES.init();
};

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	if (!building && await limiter.isLimited(event)) return error(429);
	return resolve(event);
};