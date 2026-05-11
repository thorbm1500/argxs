// Known crawlers
const CRAWLER_REGEX = new RegExp(/(visionheight)|(CensysInspect)|(paloaltonetworks)|(Bot)|(OAI)|(openai)|(ChatGPT-User)|(Yahoo! Slurp)|(amazon)|(okhttp)|(GLS)|(Axios)|(Google-Read-Aloud)|(HeadlessChrome)|(facebook)|(BingPreview)/, 'i');

export function isCrawler(headers: Headers): boolean {
	const userAgent: string | null = headers.get('user-agent');
	return userAgent ? CRAWLER_REGEX.test(userAgent) : true;
}