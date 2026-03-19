import { env } from '$env/dynamic/private';
import type { MessagePayload, MessageResponse } from '../types';

interface MessageResult extends MessageResponse {
	status?: number;
}

const API_TIMEOUT_MS = 5000;
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

function createAbortSignal(timeoutMs: number): { signal: AbortSignal; cleanup: () => void } {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	return {
		signal: controller.signal,
		cleanup: () => clearTimeout(timeoutId)
	};
}

function isAbortError(error: unknown): boolean {
	return error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError');
}

export async function submitMessage(payload: MessagePayload): Promise<MessageResult> {
	return submitMessageWithContext(payload, new Headers());
}

export async function submitMessageWithContext(
	payload: MessagePayload,
	requestHeaders: Headers
): Promise<MessageResult> {
	const { signal, cleanup } = createAbortSignal(API_TIMEOUT_MS);

	try {
		const headers = new Headers({
			'Content-Type': 'application/json',
			'x-portfolio-source-app': 'ngl-svelte',
			'x-portfolio-source-path': '/'
		});

		for (const headerName of FORWARDED_HEADER_NAMES) {
			const headerValue = requestHeaders.get(headerName);
			if (headerValue) {
				headers.set(headerName, headerValue);
			}
		}

		if (payload.timezone?.trim()) {
			headers.set('x-portfolio-timezone', payload.timezone.trim().slice(0, 100));
		}

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
