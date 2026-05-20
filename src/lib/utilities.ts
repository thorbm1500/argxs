export function copyToClipboard(value: unknown): boolean {
	if (!navigator?.clipboard || typeof value !== 'string' || String(value).length === 0) return false;

	try {
		// noinspection JSIgnoredPromiseFromCall
		navigator.clipboard.writeText(value);
	} catch (ignored) {
		return false;
	}
	return true;
}