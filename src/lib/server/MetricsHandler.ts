import type { Cookies, RequestEvent } from '@sveltejs/kit';
import Database from '$lib/server/Database';
import { SiteCookies } from '$lib/server/Definitions';

export interface VisitorMetric {
	total: bigint,
	today: bigint,
	initialTotalToday: bigint
}

export default class MetricsHandler {
	private static requestsToday: bigint = 0n;
	private static requestsTotal: bigint = 0n;
	private static visitorCache: Map<string, number> = new Map();

	// Runs once every hour
	// noinspection JSUnusedGlobalSymbols
	static readonly garbageCollection = Bun.cron('@hourly', MetricsHandler.collect);

	static async init(): Promise<void> {
		MetricsHandler.requestsTotal = await Database.getTotalVisitorAmount();
		MetricsHandler.requestsToday = await Database.getCurrentDayVisitorAmount();
	}

	getVisitorMetrics(): VisitorMetric {
		return {
			total: MetricsHandler.requestsTotal,
			today: MetricsHandler.requestsToday,
			initialTotalToday: MetricsHandler.requestsTotal - MetricsHandler.requestsToday
		};
	}

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

				console.log(` - ${new Date(Date.now()).toLocaleTimeString()}\n > Visitor Count\n + Today: ${MetricsHandler.requestsToday} | Total: ${MetricsHandler.requestsTotal}`);
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