<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import type { ActionData } from './$types';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	interface TurnstileApi {
		render(
			container: HTMLElement,
			options: {
				sitekey: string;
				theme?: 'light' | 'dark';
				callback: (token: string) => void;
				'expired-callback'?: () => void;
				'error-callback'?: () => void;
			}
		): string;
		reset(widgetId?: string): void;
	}

	interface WindowWithGtag extends Window {
		gtag?: (command: string, eventName: string, params?: Record<string, string>) => void;
	}

	let { form }: { form: ActionData } = $props();
	const PUBLIC_TURNSTILE_SITE_KEY = env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

	const hasTrackedSuccess = { value: false };
	const hasTrackedCompose = { value: false };

	const hasTurnstileConfig = Boolean(PUBLIC_TURNSTILE_SITE_KEY);

	function getAnalyticsSessionId() {
		try {
			const key = 'ngl_analytics_session';
			const existing = window.localStorage.getItem(key);
			if (existing) return existing;
			const next = `ngl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
			window.localStorage.setItem(key, next);
			return next;
		} catch {
			return 'ngl-session';
		}
	}

	async function sendFirstPartyAnalytics(payload: Record<string, unknown>) {
		try {
			await fetch('/api/analytics', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload),
				keepalive: true
			});
		} catch {
			return;
		}
	}

	function trackPageView() {
		void sendFirstPartyAnalytics({
			page: '/',
			eventType: 'pageview',
			entityType: 'page',
			entityId: '/',
			userSession: getAnalyticsSessionId(),
			timezone,
			data: {
				title: document.title,
				url: window.location.href
			}
		});
	}

	let message = $state('');
	let isSubmitting = $state(false);
	let timezone = $state('');
	let turnstileToken = $state('');
	let turnstileWidgetId = $state<string | null>(null);
	let turnstileContainer = $state<HTMLDivElement | null>(null);

	let remaining = $derived(500 - message.length);
	let isOverLimit = $derived(remaining < 0);
	let isEmpty = $derived(message.trim().length === 0);
	let shouldShowTurnstile = $derived(hasTurnstileConfig && message.trim().length > 0);
	let canSubmit = $derived(
		hasTurnstileConfig && !isEmpty && !isOverLimit && !isSubmitting && Boolean(turnstileToken)
	);

	function getTurnstile(): TurnstileApi | undefined {
		return (window as Window & { turnstile?: TurnstileApi }).turnstile;
	}

	function resetTurnstile() {
		turnstileToken = '';

		const turnstile = getTurnstile();

		if (turnstileWidgetId && turnstile) {
			turnstile.reset(turnstileWidgetId);
		}
	}

	function mountTurnstile() {
		const turnstile = getTurnstile();

		if (!shouldShowTurnstile || !turnstileContainer || !turnstile || turnstileWidgetId) {
			return;
		}

		turnstileWidgetId = turnstile.render(turnstileContainer, {
			sitekey: PUBLIC_TURNSTILE_SITE_KEY,
			theme: 'light',
			callback: (token: string) => {
				turnstileToken = token;
			},
			'expired-callback': () => {
				turnstileToken = '';
			},
			'error-callback': () => {
				turnstileToken = '';
			}
		});
	}

	function trackInteraction(entityType: string, entityId: string, label: string) {
		void sendFirstPartyAnalytics({
			page: '/',
			eventType: 'click',
			entityType,
			entityId,
			userSession: getAnalyticsSessionId(),
			timezone,
			data: {
				title: document.title,
				url: window.location.href,
				label
			}
		});
	}

	function trackSubmission() {
		const windowWithGtag = window as WindowWithGtag;

		windowWithGtag.gtag?.('event', 'ngl_submission', {
			event_category: 'engagement',
			event_label: 'anonymous_message'
		});

		trackInteraction('message_submission', 'anonymous_message', 'Anonymous message sent');
	}

	$effect(() => {
		if (form?.success) {
			message = '';
			isSubmitting = false;
			resetTurnstile();

			if (!hasTrackedSuccess.value) {
				trackSubmission();
				hasTrackedSuccess.value = true;
			}
		} else {
			hasTrackedSuccess.value = false;
		}
	});

	$effect(() => {
		if (message.trim().length > 0 && !hasTrackedCompose.value) {
			hasTrackedCompose.value = true;
			trackInteraction(
				'message_compose',
				'anonymous_message',
				'Started composing anonymous message'
			);
		}

		if (message.trim().length === 0) {
			hasTrackedCompose.value = false;
		}

		if (shouldShowTurnstile) {
			mountTurnstile();
			return;
		}

		turnstileToken = '';
		turnstileWidgetId = null;
	});

	onMount(() => {
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
		trackPageView();

		if (!hasTurnstileConfig) {
			return;
		}

		if (getTurnstile()) {
			mountTurnstile();
			return;
		}

		const intervalId = window.setInterval(() => {
			if (getTurnstile()) {
				window.clearInterval(intervalId);
				mountTurnstile();
			}
		}, 100);

		return () => window.clearInterval(intervalId);
	});
</script>

<svelte:head>
	{#if hasTurnstileConfig}
		<script
			src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
			async
			defer
		></script>
	{/if}
</svelte:head>

<div class="relative min-h-screen overflow-hidden px-4 py-10 md:px-6 md:py-14">
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div
			class="absolute left-[-4rem] top-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,var(--teal-glow),transparent_70%)] blur-3xl"
		></div>
		<div
			class="absolute right-[-4rem] top-1/4 h-56 w-56 rounded-full bg-[radial-gradient(circle,var(--amber-soft),transparent_72%)] blur-3xl"
		></div>
		<div
			class="absolute bottom-[-5rem] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--teal-soft),transparent_70%)] blur-3xl"
		></div>
	</div>

	<div
		class="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl items-center justify-center"
	>
		<div
			class="panel-card ngl-panel animate-scale-in relative w-full max-w-xl overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--bg-card)] p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)] md:p-10"
		>
			{#if form?.success}
				<div in:scale class="flex flex-col items-center py-8 text-center">
					<div
						class="ngl-success-badge mb-4 flex h-16 w-16 items-center justify-center rounded-full"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
								points="22 4 12 14.01 9 11.01"
							/></svg
						>
					</div>
					<h2 class="ngl-title mb-2 text-2xl font-bold">Message Sent!</h2>
					<p class="ngl-muted mb-6 max-w-sm text-sm">Your anonymous message has been delivered.</p>
					<a
						href={resolve('/')}
						class="btn-base px-6 py-3 text-sm inline-flex"
						data-sveltekit-reload
					>
						Send Another Message
					</a>
				</div>
			{:else}
				<div class="mb-8 text-center opacity-0 animate-fade-in-up">
					<div
						class="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] shadow-surface-sunken"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="30"
							height="30"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="text-[var(--tone-accent)]"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg
						>
					</div>
					<p
						class="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-[var(--tone-accent)]"
					>
						Anonymous message
					</p>
					<h1 class="ngl-title text-2xl font-bold md:text-3xl">Send me a message</h1>
					<p class="ngl-muted mx-auto mt-4 max-w-md text-sm leading-7 md:text-base">
						Share feedback, thoughts, or questions anonymously.
					</p>
				</div>

				<form
					method="POST"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
							resetTurnstile();
						};
					}}
					class="ngl-form space-y-5 opacity-0 animate-fade-in-up stagger-1"
				>
					<div class="relative">
						<textarea
							name="content"
							bind:value={message}
							placeholder="Type your message here..."
							rows="6"
							maxlength="550"
							disabled={isSubmitting}
							class="min-h-[220px] w-full resize-none rounded-[26px] border border-[var(--border)] bg-[var(--bg-elevated)] px-5 pb-9 pt-5 text-base disabled:opacity-50"
						></textarea>

						<div class="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2">
							<span
								class="text-xs font-medium transition-colors {remaining < 50
									? remaining < 0
										? 'text-red-500'
										: 'text-amber-500'
									: 'ngl-subtle'}"
							>
								{remaining}
							</span>
						</div>
					</div>

					<div class="space-y-3">
						{#if hasTurnstileConfig && shouldShowTurnstile}
							<div
								class="ngl-turnstile-shell rounded-[24px] border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
							>
								<div bind:this={turnstileContainer} class="flex justify-center"></div>
							</div>
						{:else if hasTurnstileConfig}
							<div class="h-0" aria-hidden="true"></div>
						{:else}
							<div class="ngl-notice-card rounded-[22px] p-4 text-sm ngl-muted">
								CAPTCHA is not configured right now, so anonymous message delivery is temporarily
								unavailable.
							</div>
						{/if}
						<input type="hidden" name="turnstileToken" value={turnstileToken} />
						<input type="hidden" name="timezone" value={timezone} />
					</div>

					{#if form?.error}
						<div transition:fade class="ngl-error-card flex items-start gap-3 rounded-[22px] p-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="mt-0.5 shrink-0 text-red-500"
								><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line
									x1="12"
									y1="16"
									x2="12.01"
									y2="16"
								/></svg
							>
							<div class="flex-1">
								<p class="text-sm font-medium text-red-600">Message not sent</p>
								<p class="mt-1 text-xs text-red-500/80">{form.error}</p>
							</div>
						</div>
					{/if}

					<button
						type="submit"
						disabled={!canSubmit}
						class="btn-base btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isSubmitting}
							<svg
								class="h-5 w-5 animate-spin"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							<span>Sending...</span>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><line x1="22" y1="2" x2="11" y2="13" /><polygon
									points="22 2 15 22 11 13 2 9 22 2"
								/></svg
							>
							<span>Send message</span>
						{/if}
					</button>
				</form>

				<div
					class="mt-8 border-t border-[var(--border)] pt-6 text-center opacity-0 animate-fade-in-up stagger-2"
				>
					<p class="text-xs text-[var(--text-tertiary)]">
						Your message is completely anonymous. I will not know who sent it.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
