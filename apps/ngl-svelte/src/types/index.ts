export interface MessagePayload {
	content: string;
	turnstileToken: string;
	timezone?: string;
}

export interface MessageResponse {
	success: boolean;
	error?: {
		message: string;
		code?: string;
	};
}
