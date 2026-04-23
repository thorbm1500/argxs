export default class Database {
	static readonly isProduction: boolean = Bun.env.NODE_ENV === 'production';
	static readonly totalId = new Date(0).toISOString().slice(0, 10);
	static currentDate: string = new Date(Date.now()).toISOString().slice(0, 10);

	// noinspection JSUnusedGlobalSymbols
	private static readonly SQL: Bun.SQL = new Bun.SQL({
		idleTimeout: 0,
		maxLifetime: 0,
		connectionTimeout: 60,
		bigint: true,
		onconnect: (err): void => {
			if (!Database.isProduction) return;
			if (err) {
				console.error(`Failed to connect to database. `, err);
			} else {
				console.debug('New database connection established.');
			}
		}
	});

	static async init(): Promise<void> {
		if (!Database.isProduction) return;

		Bun.cron('@midnight', this.insertNewDay);

		await Database.SQL`CREATE TABLE IF NOT EXISTS metrics
		                   (
												 date     varchar(10) PRIMARY KEY,
			                   visitors BIGINT DEFAULT 0 NOT NULL
		                   )`;

		await Database.SQL`INSERT INTO metrics VALUES (${this.totalId},0)`.catch();
		await Database.SQL`INSERT INTO metrics VALUES (${this.currentDate},0)`.catch();
	}

	private static async insertNewDay(): Promise<void> {
		if (!Database.isProduction) return;
		await Database.SQL`INSERT INTO metrics VALUES (${new Date(Date.now() + 90000000).toISOString().slice(0, 10)},0)`.catch((err) =>
			console.error(err)
		);

		this.currentDate = new Date(Date.now() + 360000).toISOString().slice(0, 10);
	}

	static async getTotalVisitorAmount(): Promise<number> {
		if (!Database.isProduction) return -1;

		const result = await Database.SQL`SELECT visitors FROM metrics WHERE date=${this.totalId}`;
		return result[0].visitors ?? 0;
	}

	static async getCurrentDayVisitorAmount(): Promise<number> {
		if (!Database.isProduction) return 0;

		const result = await Database.SQL`SELECT visitors FROM metrics WHERE date=${this.totalId}`.catch(async () => {
			Database.SQL`INSERT INTO metrics VALUES (${this.currentDate}, 0)`.catch();
		});
		return result[0].visitors ?? 0;
	}

	static async updateTotalVisitorAmount(amount: number): Promise<void> {
		if (!Database.isProduction) return;

		await Database.SQL`UPDATE metrics SET visitors = ${amount} WHERE date=${this.totalId}`;
	}

	static async updateCurrentDayVisitorAmount(amount: number): Promise<void> {
		if (!Database.isProduction) return;

		await Database.SQL`UPDATE metrics SET visitors = ${amount} WHERE date=${this.currentDate}`;
	}

	static async incrementVisitorCount(total: number, daily: number): Promise<void> {
		await this.updateTotalVisitorAmount(total);
		await this.updateCurrentDayVisitorAmount(daily);
	}
}