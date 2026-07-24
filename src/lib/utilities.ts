export async function copyToClipboard(value: unknown): Promise<boolean> {
	if (!navigator?.clipboard || typeof value !== 'string' && String(value).length === 0) return false;

	try {
		await navigator.clipboard.writeText(String(value));
	} catch (ignored) {
		return false;
	}
	return true;
}

/**
 * Compares to version tags, of the format '0.0.0'. Each version tag can be undefined to account for
 * potential misconfigurations.
 * @param a First version tag
 * @param b Second version tag
 */
export function compareVersionTags(a: string | undefined, b: string | undefined): number {
	if (!a && !b) return 0;
	else if (!a) return 1;
	else if (!b) return -1;

	let ao = { first: 0, second: 0, third: 0 };
	let bo = { first: 0, second: 0, third: 0 };
	
	let aIndex = a.indexOf('.',a.indexOf('.'));
	let bIndex = b.indexOf('.',b.indexOf('.'));

	ao.first = Number.parseInt(a.slice(0, a.indexOf('.')));
	bo.first = Number.parseInt(b.slice(0, b.indexOf('.')));
	if (ao.first - bo.first !== 0) return ao.first > bo.first ? -1 : 1;

	ao.second = Number.parseInt(a.slice(aIndex + 1, a.indexOf('.', aIndex + 1)));
	bo.second = Number.parseInt(b.slice(bIndex + 1, b.indexOf('.', bIndex + 1)));
	if (ao.second - bo.second !== 0) return ao.second > bo.second ? -1 : 1;

	ao.third = Number.parseInt(a.slice(a.indexOf('.', aIndex + 1) + 1));
	bo.third = Number.parseInt(b.slice(b.indexOf('.', bIndex + 1) + 1));

	return ao.third > bo.third ? -1 : 1;
}

export function generateHash(value: string): number {
	let hash = 0;
	for (const char of value) {
		hash = (hash << 5) - hash + char.charCodeAt(0);
		hash |= 0; // Constrain to 32bit integer
	}
	return hash;
}

export function formatNanoseconds(start: number, end: number): string {
	let time: number = end - start;

	// Nanoseconds
	if (time < 1000) return `${time}ns`;
	else time = time / 1000;

	// Microseconds
	if (time < 1000) return `${Math.trunc(time)}µs`;
	else time = time / 1000;

	// Milliseconds
	if (time < 10000) return `${Math.trunc(time)}ms`;
	else time = time / 1000;

	// Seconds
	if (time < 60) return `${time.toFixed(2)}s`;
	else time = time / 60;

	// Minutes
	if (time < 60) {
		const decimal: number = time - Math.trunc(time);

		if (decimal > .5) return `${Math.trunc(time)}.5m`;
		else return `${Math.trunc(time)}m`;
	}
	else time = time / 60;

	// Hours
	if (time < 24) {
		const decimal: number = time - Math.trunc(time);

		if (decimal > .5) return `${Math.trunc(time)}.5h`;
		else return `${Math.trunc(time)}h`;
	}
	else time = time / 24;

	// Days
	if (time < 7) {
		const decimal: number = time - Math.trunc(time);

		if (decimal > .5) return `${Math.trunc(time)}.5d`;
		else return `${Math.trunc(time)}d`;
	}
	// Average days pr. month, of 365 days with 12 months.
	else time = time / 7;

	// Weeks
	if (time < 4) {
		const decimal: number = time - Math.trunc(time);

		if (decimal > .5) return `${Math.trunc(time)}.5w`;
		else return `${Math.trunc(time)}w`;
	}
	else time = time / 4;

	// Months
	if (time < 12) {
		const decimal: number = time - Math.trunc(time);

		if (decimal > .5) return `${Math.trunc(time)}.5M`;
		else return `${Math.trunc(time)}M`;
	}

	// Years
	return `${((time * 4) / 365).toFixed(1)}y`;
}

export class MathUtils {
	static clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(min, value), max);
	}
}