import { SITEMAP } from '../../hooks.server.ts';

export async function GET(): Promise<Response> {
	return new Response(SITEMAP, { headers: { 'Content-Type': 'application/xml' }});
}