import { building } from '$app/environment';

const isProduction: boolean = !building && Bun.env.NODE_ENV === 'production';
const totalId: string = new Date(0).toISOString().slice(0, 10);

export default class Database {
	static currentDate: string;

	constructor() {
		Database.currentDate = new Date(Date.now()).toISOString().slice(0, 10);
	}

	// noinspection JSUnusedGlobalSymbols
	private static readonly SQL: Bun.SQL = new Bun.SQL({
		idleTimeout: 0,
		maxLifetime: 0,
		connectionTimeout: 60,
		bigint: true,
		onconnect: (err): void => {
			if (!isProduction) return;
			if (err) {
				console.error(`Failed to connect to database. `, err);
			} else {
				console.debug('New database connection established.');
			}
		}
	});

	static async init(): Promise<void> {
		if (!isProduction) return;

		Bun.cron('@midnight', this.insertNewDay);

		await Database.SQL`CREATE TABLE IF NOT EXISTS metrics
		                   (
												 date     varchar(10) PRIMARY KEY,
			                   visitors BIGINT DEFAULT 0 NOT NULL
		                   )`.catch(ignored => []);

		await Database.SQL`INSERT INTO metrics(date,visitors) VALUES (${totalId},0)`.catch(ignored => []);
		await Database.SQL`INSERT INTO metrics(date,visitors) VALUES (${this.currentDate},0)`.catch(ignored => []);
	}

	static async getTotalVisitorAmount(): Promise<number> {
		if (!isProduction) return -1;

		const result = await Database.SQL`SELECT visitors FROM metrics WHERE date=${totalId}`.catch(ignored => []);
		return result[0].visitors ?? 0;
	}

	static async getCurrentDayVisitorAmount(): Promise<number> {
		if (!isProduction) return 0;

		const result = await Database.SQL`SELECT visitors FROM metrics WHERE date=${this.currentDate}`.catch(async () => {
			Database.SQL`INSERT INTO metrics VALUES (${this.currentDate}, 0)`.catch(ignored => []);
		});

		return result[0].visitors ?? 0;
	}

	static async updateTotalVisitorAmount(amount: number): Promise<void> {
		if (!isProduction) return;

		await Database.SQL`UPDATE metrics SET visitors = ${amount} WHERE date=${totalId}`.catch(ignored => []);
	}

	static async updateCurrentDayVisitorAmount(amount: number): Promise<void> {
		if (!isProduction) return;

		await Database.SQL`UPDATE metrics SET visitors = ${amount} WHERE date=${this.currentDate}`.catch(ignored => []);
	}

	static async incrementVisitorCount(total: number, daily: number): Promise<void> {
		await this.updateTotalVisitorAmount(total);
		await this.updateCurrentDayVisitorAmount(daily);
	}

	private static async insertNewDay(): Promise<void> {
		if (!isProduction) return;
		await Database.SQL`INSERT INTO metrics VALUES (${new Date(Date.now() + 90000000).toISOString().slice(0, 10)},0)`.catch((err) =>
			console.error(err)
		);

		this.currentDate = new Date(Date.now() + 360000).toISOString().slice(0, 10);
	}
}