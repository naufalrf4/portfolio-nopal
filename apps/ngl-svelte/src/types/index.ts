export interface MessagePayload {
	content: string;
	turnstileToken: string;
}

export interface MessageResponse {
	success: boolean;
	error?: {
		message: string;
		code?: string;
	};
}
