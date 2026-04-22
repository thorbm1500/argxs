export function copyToClipboard(value: unknown): boolean {
	if (!navigator?.clipboard || typeof value !== 'string' || String(value).length === 0) return false;

	// noinspection JSIgnoredPromiseFromCall
	navigator.clipboard.writeText(value);
	return true;
}