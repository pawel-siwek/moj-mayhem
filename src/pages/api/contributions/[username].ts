import type { APIRoute } from 'astro';

export const prerender = false;

// TODO: Zaimplementuj handler GET pobierający dane o kontrybucjach z GitHuba
// Endpoint: https://github.com/{username}.contribs
export const GET: APIRoute = async ({ params }) => {
	return new Response(JSON.stringify({ error: 'Jeszcze nie zaimplementowano' }), {
		status: 501,
		headers: { 'Content-Type': 'application/json' },
	});
};
