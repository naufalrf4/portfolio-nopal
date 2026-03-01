<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { fade, scale } from 'svelte/transition';

	let { form }: { form: ActionData } = $props();

	let message = $state('');
	let isSubmitting = $state(false);

	let remaining = $derived(500 - message.length);
	let isOverLimit = $derived(remaining < 0);
	let isEmpty = $derived(message.trim().length === 0);
	let canSubmit = $derived(!isEmpty && !isOverLimit && !isSubmitting);

	// Reset message when success
	$effect(() => {
		if (form?.success) {
			message = '';
			isSubmitting = false;
		}
	});
</script>

<svelte:head>
	<title>NGL | Anonymous Messages</title>
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center p-4">
	<div class="neu-card w-full max-w-md p-8 relative overflow-hidden transition-all duration-300">
		
		{#if form?.success}
			<div in:scale class="flex flex-col items-center py-8 text-center">
				<div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
				</div>
				<h2 class="text-xl font-bold mb-2">Message Sent!</h2>
				<p class="text-gray-400 text-sm mb-6">
					Your anonymous message has been delivered.
				</p>
				<a
					href="/"
					class="neu-button px-6 py-3 text-sm inline-block"
					data-sveltekit-reload
				>
					Send Another Message
				</a>
			</div>
		{:else}
			<div class="mb-6 text-center">
				<h1 class="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
					Send me a message
				</h1>
				<p class="text-gray-400 text-sm">
					100% anonymous & private
				</p>
			</div>

			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						await update();
						isSubmitting = false;
					};
				}}
				class="ngl-form space-y-4"
			>
				<div class="relative">
					<textarea
						name="content"
						bind:value={message}
						placeholder="Type your message here..."
						rows="5"
						maxlength="550"
						disabled={isSubmitting}
						class="neu-input ngl-textarea resize-none min-h-[150px] pr-4 pb-8 w-full disabled:opacity-50"
					></textarea>

					<div class="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none">
						<span
							class="text-xs font-medium transition-colors {remaining < 50 ? (remaining < 0 ? 'text-red-500' : 'text-amber-500') : 'text-gray-500'}"
						>
							{remaining}
						</span>
					</div>
				</div>

				<!-- Hidden input for Turnstile token - this will cause a 422 error on submission which is expected behavior without the widget -->
				<input type="hidden" name="turnstileToken" value="" />

				{#if form?.error}
					<div transition:fade class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
						<div class="flex-1">
							<p class="text-sm font-medium text-red-500">Failed to send</p>
							<p class="text-xs text-red-400/80 mt-1">{form.error}</p>
						</div>
					</div>
				{/if}

				<button
					type="submit"
					disabled={!canSubmit}
					class="neu-button neu-button-primary ngl-submit w-full justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3 flex items-center"
				>
					{#if isSubmitting}
						<svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span>Sending...</span>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
						<span>Send Message</span>
					{/if}
				</button>
			</form>
		{/if}
	</div>
</div>
