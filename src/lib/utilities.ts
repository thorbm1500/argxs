export async function copyToClipboard(value: unknown): Promise<boolean> {
	if (!navigator?.clipboard || typeof value !== 'string' && String(value).length === 0) return false;

	try {
		await navigator.clipboard.writeText(String(value));
	} catch (ignored) {
		return false;
	}
	return true;
}