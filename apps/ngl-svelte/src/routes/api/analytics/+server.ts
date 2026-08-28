import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { buildProxyHeaders } from '@naufalrf/http';
import { logger } from '../../../hooks.server';

const adminApiUrl = env.ADMIN_API_URL ?? 'http://localhost:3001';
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
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
			headers: buildProxyHeaders(
				'ngl-svelte',
				sourcePath,
				request.headers,
				timezone,
				getClientAddress()
			),
			body: JSON.stringify(body)
		});

		return new Response(await response.text(), {
			status: response.status,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		logger.error('Failed to track NGL analytics event', error);
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
