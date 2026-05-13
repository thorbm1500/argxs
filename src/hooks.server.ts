import { building } from '$app/environment';
import { error, type Handle, type ServerInit } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { Resources } from '$lib/server/Resources';
import MetricsHandler from '$lib/server/MetricsHandler';
import Database from '$lib/server/Database';
import { SiteCookies } from '$lib/server/Definitions';
import { isCrawler } from '$lib/server/utilities';
import processImages from '$lib/server/ImageWorker';

const limiter = new RateLimiter({ IP: [1, '100ms'] });
const metricsHandler = new MetricsHandler();

export const VERSION: string = await Bun.file('./package.json').json().then((pkg) => pkg.version);
export const RESOURCES: Resources = new Resources();

// noinspection JSUnusedGlobalSymbols
export const init: ServerInit = async () => {
	if (building) return;

	await Database.init();
	await MetricsHandler.init();
	await RESOURCES.init();

	if (Bun.env.NODE_ENV === 'production') {
		/** The image worker should only be run/scheduled on the server, and not during development
		 *  The worker is set to run at midnight, every day.
		 *  All icons will be checked and processed, ensuring all of them have PNG,WEBP, and JPEG versions available */
		Bun.cron('0 0 */1 * *', processImages);

		// Run processing right away, if the job is not scheduled to run within the next hour.
		if ((Bun.cron.parse('0 0 */1 * *')?.getTime() ?? 0) > 3600000) {
			// noinspection ES6MissingAwait - Ignored purposefully.
			processImages();
		}
	}
};

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	// Attempt to forcefully deny access for crawlers.
	if (isCrawler(event.request.headers)) return error(403);

	if (await limiter.isLimited(event).catch(() => true)) {
		return building ? resolve(event) : error(429);
	}

	const theme: string | undefined = event.cookies.get(SiteCookies.Theme);
	if (theme === 'light' || theme === 'dark') event.locals.theme = theme;

	event.locals.requests = metricsHandler.getVisitorMetrics();

	// noinspection ES6MissingAwait - Ignored purposefully.
	metricsHandler.process(event);

	return resolve(event);
};