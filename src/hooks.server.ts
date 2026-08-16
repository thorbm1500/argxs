import { building } from '$app/environment';
import { type Handle, type HandleServerError, type ServerInit } from '@sveltejs/kit';
import { Resources } from '$lib/server/Resources';
import MetricsHandler from '$lib/server/MetricsHandler';
import Database from '$lib/server/Database';
import { SiteCookies } from '$lib/server/Definitions';
import processImages from '$lib/server/ImageWorker';

const metricsHandler = new MetricsHandler();

export const VERSION: string = await Bun.file('./package.json').json().then((pkg) => pkg.version);
export const RESOURCES: Resources = new Resources();

export const SITEMAP: string = (await Bun.file(Bun.env.NODE_ENV === 'production' ? './sitemap.xml' : 'src/lib/server/sitemap.xml').text()).trim();

export const handleError: HandleServerError = async ({ error }) => {
	console.error(Bun.inspect(error, { colors: true, compact: false, depth: 50, sorted: false }));

	return {
		message: 'Whoops.. Sorry!'
	};
};

// noinspection JSUnusedGlobalSymbols
export const init: ServerInit = async () => {
	await RESOURCES.init();
	if (building) return;

	await Database.init();
	await MetricsHandler.init();

	if (Bun.env.NODE_ENV === 'production') {
		// Run processing right away, to ensure all downloads are available to users.
		await processImages();
	}

	console.info(`Initialization completed.\n[Status] VERSION: ${VERSION}`);
};

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	const theme: string | undefined = event.cookies.get(SiteCookies.Theme);
	if (theme === 'light' || theme === 'dark') event.locals.theme = theme;

	event.locals.requests = metricsHandler.getVisitorMetrics();

	void metricsHandler.process(event);

	return resolve(event);
};