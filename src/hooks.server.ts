import { building } from '$app/environment';
import { error, type Handle, type ServerInit } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { Resources } from '$lib/server/Resources';
import { env } from '$env/dynamic/private';

const limiter = new RateLimiter({ IP: [1, '100ms'] });

export const VERSION: string = await Bun.file('./package.json').json().then(pkg => pkg.version);
export const RESOURCES: Resources = new Resources();

// noinspection JSUnusedGlobalSymbols
export const init: ServerInit = async () => {
	if (env.NODE_ENV === 'production' && !building) return;
	await RESOURCES.init();
};

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	if (await limiter.isLimited(event).catch(() => true)) {
		return building ? resolve(event) : error(429);
	}
	return resolve(event);
};