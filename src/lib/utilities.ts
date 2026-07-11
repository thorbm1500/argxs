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
	if (ao.first - bo.first !== 0) return ao.first - bo.first;

	ao.second = Number.parseInt(a.slice(aIndex + 1, a.indexOf('.', aIndex + 1)));
	bo.second = Number.parseInt(b.slice(bIndex + 1, b.indexOf('.', bIndex + 1)));
	if (ao.second - bo.second !== 0) return ao.second - bo.second;

	ao.third = Number.parseInt(a.slice(a.indexOf('.', aIndex + 1) + 1));
	bo.third = Number.parseInt(b.slice(b.indexOf('.', bIndex + 1) + 1));

	return ao.third - bo.third;
}