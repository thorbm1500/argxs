import type { Cookies, RequestEvent } from '@sveltejs/kit';
import Database from '$lib/server/Database';
import { SiteCookies } from '$lib/server/Definitions';

export interface VisitorMetric {
	total: number,
	today: number,
	initialTotalToday: number
}

export default class MetricsHandler {
	private static requestsToday: number = 0;
	private static requestsTotal: number = 0;
	private static visitorCache: Map<string, number> = new Map();

	// Runs once every hour
	// noinspection JSUnusedGlobalSymbols
	static readonly garbageCollection = Bun.cron('0 * * * *', MetricsHandler.collect);

	static async init(): Promise<void> {
		MetricsHandler.requestsTotal = await Database.getTotalVisitorAmount();
		MetricsHandler.requestsToday = await Database.getCurrentDayVisitorAmount();
	}

	getVisitorMetrics(): VisitorMetric {
		return {
			total: Number.parseInt(String(MetricsHandler.requestsTotal)),
			today: Number.parseInt(String(MetricsHandler.requestsToday)),
			initialTotalToday: Number.parseInt(String(MetricsHandler.requestsTotal)) - Number.parseInt(String(MetricsHandler.requestsToday))
		};
	}

	//todo: Implement opting out
	/**
	 * Checks if the visitor has opted out of site tracking.
	 * @param cookies The visitor's cookies
	 * @private
	 */
	private isOptedOut(cookies: Cookies): boolean {
		return cookies.get(SiteCookies.OptOut) !== undefined;
	}

	async process(event: RequestEvent): Promise<void> {
		if (!event) return;
		// Allow users to deny the usage of their IP addresses for site statistics.
		if (this.isOptedOut(event.cookies)) return;

		// Processed in try/catch, as calling event#getClientAddress has thrown errors in the past.
		try {
			const client: string = event.getClientAddress();
			const cache: number | undefined = MetricsHandler.visitorCache.get(client);

			MetricsHandler.visitorCache.set(client, Date.now() + 900000);

			if (!cache || Date.now() > cache) {
				MetricsHandler.requestsTotal++;
				MetricsHandler.requestsToday++;
				// noinspection ES6MissingAwait
				Database.incrementVisitorCount(MetricsHandler.requestsTotal, MetricsHandler.requestsToday);
			}
		} catch (ignored) {}
	}

	private static collect(): void {
		const current: number = Date.now() + 900000;

		MetricsHandler.visitorCache.forEach((value, key): void => {
			if (current > value) MetricsHandler.visitorCache.delete(key);
		});
	}
}