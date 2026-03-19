import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const adminApiUrl = env.ADMIN_API_URL ?? 'http://localhost:3001';
const FORWARDED_HEADER_NAMES = [
	'x-forwarded-for',
	'x-real-ip',
	'x-vercel-forwarded-for',
	'cf-connecting-ip',
	'user-agent',
	'accept-language',
	'referer'
] as const;

function normalizeValue(value: string | null, maxLength = 255): string | null {
	if (!value) return null;
	const normalized = value.trim();
	return normalized ? normalized.slice(0, maxLength) : null;
}

function buildAnalyticsProxyHeaders({
	request,
	sourcePath,
	timezone
}: {
	request: Request;
	sourcePath: string;
	timezone?: string;
}): Headers {
	const headers = new Headers({
		'Content-Type': 'application/json',
		'x-portfolio-source-app': 'ngl-svelte',
		'x-portfolio-source-path': sourcePath
	});

	for (const headerName of FORWARDED_HEADER_NAMES) {
		const value = normalizeValue(
			request.headers.get(headerName),
			headerName === 'referer' ? 512 : 255
		);
		if (value) {
			headers.set(headerName, value);
		}
	}

	const normalizedTimezone = normalizeValue(timezone ?? null, 100);
	if (normalizedTimezone) {
		headers.set('x-portfolio-timezone', normalizedTimezone);
	}

	return headers;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const timezone =
			body && typeof body === 'object' && typeof body.timezone === 'string'
				? body.timezone
				: undefined;
		const sourcePath =
			body && typeof body === 'object' && typeof body.page === 'string' ? body.page : '/';

		const response = await fetch(`${adminApiUrl}/api/v1/public/analytics`, {
			method: 'POST',
			headers: buildAnalyticsProxyHeaders({ request, sourcePath, timezone }),
			body: JSON.stringify(body)
		});

		return new Response(await response.text(), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch {
		return new Response(
			JSON.stringify({ success: false, error: { message: 'Failed to track analytics event.' } }),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}
};
