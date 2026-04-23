import type { RequestEvent } from '@sveltejs/kit';
import Database from '$lib/server/Database';

export default class MetricsHandler {
	private static dailyRequests: number = 0;
	private static totalRequests: number = 0;
	private static visitorCache: Map<string, number> = new Map();

	// Runs once every hour
	// noinspection JSUnusedGlobalSymbols
	static readonly garbageCollection = Bun.cron('0 * * * *', MetricsHandler.collect);

	static async init(): Promise<void> {
		MetricsHandler.totalRequests = await Database.getTotalVisitorAmount();
		MetricsHandler.dailyRequests = await Database.getCurrentDayVisitorAmount();
	}

	getRequestsAmount(): number {
		return MetricsHandler.totalRequests;
	}

	async process(event: RequestEvent): Promise<void> {
		// Processed in try/catch, as calling event#getClientAddress has thrown errors in the past.
		try {
			const client: string = event.getClientAddress();
			const cache: number | undefined = MetricsHandler.visitorCache.get(client);

			MetricsHandler.visitorCache.set(client, Date.now() + 900000);

			if (!cache || Date.now() > cache) {
				MetricsHandler.totalRequests++;
				MetricsHandler.dailyRequests++;
				// noinspection ES6MissingAwait
				Database.incrementVisitorCount(MetricsHandler.totalRequests, MetricsHandler.dailyRequests);
			}
		} catch (ignored) {}
	}

	private static collect(): void {
		console.log('[Metrics] Garbage Collector running...');
		const current: number = Date.now() + 900000;

		MetricsHandler.visitorCache.forEach((value, key): void => {
			if (current > value) MetricsHandler.visitorCache.delete(key);
		});
	}
}