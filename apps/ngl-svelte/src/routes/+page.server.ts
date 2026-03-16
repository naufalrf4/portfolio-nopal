import { fail, type Actions } from '@sveltejs/kit';
import { submitMessageWithContext } from '$lib/api';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const content = formData.get('content');
		const turnstileToken = formData.get('turnstileToken');
		const timezone = formData.get('timezone');

		if (!content || typeof content !== 'string') {
			return fail(422, { error: 'Message is required' });
		}

		const trimmedContent = content.trim();

		if (trimmedContent.length === 0) {
			return fail(422, { error: 'Message is required' });
		}

		if (trimmedContent.length > 500) {
			return fail(422, { error: 'Message must be 500 characters or less' });
		}

		if (!turnstileToken || typeof turnstileToken !== 'string') {
			return fail(422, { error: 'CAPTCHA verification is required' });
		}

		const result = await submitMessageWithContext(
			{
				content: trimmedContent,
				turnstileToken,
				timezone: typeof timezone === 'string' ? timezone.trim() || undefined : undefined
			},
			request.headers
		);

		if (!result.success) {
			return fail(result.status ?? 422, {
				error: result.error?.message || 'Failed to send message'
			});
		}

		return { success: true };
	}
};
