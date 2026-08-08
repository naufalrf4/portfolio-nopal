import { env } from '$env/dynamic/private';
import type { MessagePayload, MessageResponse } from '@naufalrf/contracts';
import { buildProxyHeaders, createAbortSignal, isAbortError } from '@naufalrf/http';

interface MessageResult extends MessageResponse {
	status?: number;
}

const API_TIMEOUT_MS = 5000;
const adminApiUrl = env.ADMIN_API_URL ?? 'http://localhost:3001';
export async function submitMessage(payload: MessagePayload): Promise<MessageResult> {
	return submitMessageWithContext(payload, new Headers());
}

export async function submitMessageWithContext(
	payload: MessagePayload,
	requestHeaders: Headers
): Promise<MessageResult> {
	const { signal, cleanup } = createAbortSignal(API_TIMEOUT_MS);

	try {
		const headers = buildProxyHeaders('ngl-svelte', '/', requestHeaders, payload.timezone);

		const response = await fetch(`${adminApiUrl}/api/v1/public/messages`, {
			method: 'POST',
			headers,
			body: JSON.stringify(payload),
			signal
		});

		const data = (await response.json().catch(() => null)) as MessageResponse | null;

		if (!response.ok) {
			return {
				success: false,
				error: data?.error ?? { message: 'Failed to send message' },
				status: response.status
			};
		}

		return {
			...(data ?? { success: true }),
			status: response.status
		};
	} catch (error) {
		if (isAbortError(error)) {
			return {
				success: false,
				error: {
					message: 'Message service timed out. Please try again.',
					code: 'UPSTREAM_TIMEOUT'
				},
				status: 504
			};
		}

		return {
			success: false,
			error: {
				message: 'Message service is temporarily unavailable. Please try again later.',
				code: 'UPSTREAM_UNAVAILABLE'
			},
			status: 503
		};
	} finally {
		cleanup();
	}
}
