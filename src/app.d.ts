// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { VisitorMetric } from '$lib/server/MetricsHandler.ts';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			theme: 'light' | 'dark';
			requests: VisitorMetric
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'bun' {
	interface Env {
		NODE_ENV: string;
		PGUSERNAME: string;
		PGPASSWORD: string;
		PGDATABASE: string;
		PGHOST: string;
	}
}

export {};