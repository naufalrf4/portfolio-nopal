import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createLogger, createLogShipper } from '@naufalrf/http';
import type { LogEntryInput } from '@naufalrf/contracts';

const adminApiUrl = env.ADMIN_API_URL ?? 'http://localhost:3001';
const adminInternalApiToken =
	env.ADMIN_INTERNAL_API_TOKEN?.trim() || env.ADMIN_SERVICE_TOKEN?.trim() || '';

function createNglApiSink(): ((entry: LogEntryInput) => void) | undefined {
	if (!adminInternalApiToken) return undefined;
	const shipper = createLogShipper({
		endpoint: `${adminApiUrl}/api/v1/internal/logs`,
		token: adminInternalApiToken
	});
	return (entry) => shipper.enqueue(entry);
}

export const logger = createLogger({
	service: 'ngl-svelte',
	sink: createNglApiSink()
});

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
	response.headers.set(
		'Content-Security-Policy',
		"default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; form-action 'self'; img-src 'self' data: https://challenges.cloudflare.com https://www.google-analytics.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://region1.google-analytics.com;"
	);
	return response;
};
