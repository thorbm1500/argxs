import { building } from '$app/environment';
import { error, type Handle, type ServerInit } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { Resources } from '$lib/server/Resources';
import { env } from '$env/dynamic/private';
import MetricsHandler from '$lib/server/MetricsHandler';

const limiter = new RateLimiter({ IP: [1, '100ms'] });
const metricsHandler = new MetricsHandler();

export const VERSION: string = await Bun.file('./package.json')
	.json()
	.then((pkg) => pkg.version);
export const RESOURCES: Resources = new Resources();

// noinspection JSUnusedGlobalSymbols
export const init: ServerInit = async () => {
	if (building) return;
	await RESOURCES.init();
};

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	if (await limiter.isLimited(event).catch(() => true)) {
		return building ? resolve(event) : error(429);
	}

	const theme: string | undefined = event.cookies.get('argxs_theme');
	if (theme === undefined || (theme !== 'light' && theme !== 'dark')) {
		event.cookies.set('argxs_theme', 'light', {
			path: '/',
			sameSite: 'lax',
			secure: Boolean(env.NODE_ENV === 'production')
		});
		event.locals.theme = 'light';
	} else event.locals.theme = theme;

	event.locals.requests = metricsHandler.getRequestsAmount();

	// Ignored purposefully t
	// noinspection ES6MissingAwait
	metricsHandler.process(event);

	return resolve(event);
};