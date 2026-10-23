import type { APIRoute } from 'astro';
import { TtlCache } from '../../../lib/ttl-cache';

export const prerender = false;

const TTL_SECONDS = 600;
const USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

class UpstreamError extends Error {
	constructor(
		public status: number,
		message: string,
		public retryAfter?: string | null,
	) {
		super(message);
	}
}

const cache = new TtlCache<string>(TTL_SECONDS * 1000);

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
	return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

async function fetchContribs(username: string): Promise<string> {
	let res: Response;
	try {
		res = await fetch(`https://github.com/${encodeURIComponent(username)}.contribs`, {
			headers: { Accept: 'application/json' },
			signal: AbortSignal.timeout(10_000),
		});
	} catch (err) {
		if (err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
			throw new UpstreamError(504, 'GitHub nie odpowiedział w czasie.');
		}
		throw new UpstreamError(502, 'Nie udało się połączyć z GitHubem.');
	}

	if (res.status === 404) throw new UpstreamError(404, 'Nie znaleziono użytkownika.');
	if (res.status === 429 || res.status === 403) {
		throw new UpstreamError(429, 'Przekroczono limit zapytań do GitHuba.', res.headers.get('retry-after'));
	}
	if (!res.ok) throw new UpstreamError(502, 'GitHub zwrócił błąd.');

	const body = await res.text();
	try {
		JSON.parse(body);
	} catch {
		throw new UpstreamError(502, 'GitHub zwrócił niepoprawną odpowiedź.');
	}
	return body;
}

export const GET: APIRoute = async ({ params }) => {
	const username = params.username ?? '';
	if (!USERNAME_RE.test(username)) {
		return json({ error: 'Niepoprawna nazwa użytkownika.' }, 400);
	}

	const key = username.toLowerCase();
	const cacheControl = `public, max-age=${TTL_SECONDS}, stale-while-revalidate=60`;

	const cached = cache.get(key);
	if (cached !== undefined) {
		return json(cached, 200, { 'Cache-Control': cacheControl, 'X-Cache': 'HIT' });
	}

	try {
		const body = await cache.dedupe(key, async () => {
			const data = await fetchContribs(key);
			cache.set(key, data);
			return data;
		});
		return json(body, 200, { 'Cache-Control': cacheControl, 'X-Cache': 'MISS' });
	} catch (err) {
		if (err instanceof UpstreamError) {
			const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
			if (err.retryAfter) headers['Retry-After'] = err.retryAfter;
			return json({ error: err.message }, err.status, headers);
		}
		return json({ error: 'Wewnętrzny błąd serwera.' }, 500, { 'Cache-Control': 'no-store' });
	}
};
