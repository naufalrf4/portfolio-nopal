import { ADMIN_API_URL, SERVICE_TOKEN } from '$env/static/private';
import type { MessagePayload, MessageResponse } from '../types';

export async function submitMessage(payload: MessagePayload): Promise<MessageResponse> {
	const response = await fetch(`${ADMIN_API_URL}/api/v1/public/messages`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Service-Token': SERVICE_TOKEN
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const data: MessageResponse = await response.json();
		return data;
	}

	return await response.json();
}
