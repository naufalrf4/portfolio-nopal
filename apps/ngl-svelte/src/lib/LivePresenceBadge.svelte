<script lang="ts">
	import { onMount } from 'svelte';

	export let socketUrl = 'ws://localhost:3006/ws';

	type Status = 'connecting' | 'connected' | 'disconnected';
	type PresenceParticipant = {
		id: string;
		name: string;
		color: string;
		pageLabel: string;
		sectionLabel: string | null;
	};
	type PresenceMessage =
		| { type: 'welcome'; payload: { selfId: string; roomId: string } }
		| { type: 'overview'; payload: { participants: PresenceParticipant[] } };

	const HEARTBEAT_MS = 5000;
	const RECONNECT_DELAY_MS = 5000;
	const HEALTHCHECK_TIMEOUT_MS = 1500;
	const SHARED_GUEST_KEY = 'portfolio-live-presence-guest';

	let status: Status = 'disconnected';
	let participants: PresenceParticipant[] = [];
	let selfId: string | null = null;
	let isOpen = false;
	let socket: WebSocket | null = null;
	let heartbeatId: ReturnType<typeof setInterval> | null = null;
	let reconnectId: ReturnType<typeof setTimeout> | null = null;
	let shouldReconnect = false;

	function getSocketUrl(url: string) {
		return url.trim() || 'ws://localhost:3006/ws';
	}

	function getHealthUrl(url: string) {
		try {
			const normalized = getSocketUrl(url);
			const base = normalized.replace(/^ws(s?):\/\//, (_match, secure) =>
				secure ? 'https://' : 'http://'
			);
			return base.replace(/\/ws(?:\?.*)?$/, '/health');
		} catch {
			return null;
		}
	}

	function hashString(value: string) {
		return Array.from(value).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
	}

	function getColorFromSeed(seed: string) {
		const palette = ['#3B82F6', '#60A5FA', '#38BDF8', '#22C55E', '#8B5CF6', '#0EA5E9'];
		return palette[hashString(seed) % palette.length] || '#3B82F6';
	}

	function resolveIdentity() {
		try {
			const raw = localStorage.getItem(SHARED_GUEST_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as { id?: string; name?: string; color?: string };
				if (parsed.id && parsed.name && parsed.color) {
					return { id: parsed.id, name: parsed.name, color: parsed.color };
				}
			}
		} catch {
			// Ignore broken storage and regenerate.
		}

		const alias = `Guest_${Math.random().toString(36).slice(2, 6)}`;
		const identity = {
			id: `guest:${alias.toLowerCase()}`,
			name: alias,
			color: getColorFromSeed(alias)
		};
		localStorage.setItem(SHARED_GUEST_KEY, JSON.stringify(identity));
		return identity;
	}

	const identity =
		typeof window === 'undefined'
			? { id: 'guest:ngl', name: 'Guest_ngl', color: '#3B82F6' }
			: resolveIdentity();

	function clearTimers() {
		if (heartbeatId) {
			clearInterval(heartbeatId);
			heartbeatId = null;
		}
		if (reconnectId) {
			clearTimeout(reconnectId);
			reconnectId = null;
		}
	}

	function scheduleReconnect() {
		clearTimers();
		if (!shouldReconnect || reconnectId) return;
		reconnectId = setTimeout(() => {
			reconnectId = null;
			void connect();
		}, RECONNECT_DELAY_MS);
	}

	async function connect() {
		clearTimers();
		shouldReconnect = true;
		status = 'connecting';

		const healthUrl = getHealthUrl(socketUrl);
		if (healthUrl) {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT_MS);
			try {
				const response = await fetch(healthUrl, {
					method: 'GET',
					signal: controller.signal,
					cache: 'no-store'
				});
				if (!response.ok) {
					throw new Error(`Presence health check failed with status ${response.status}`);
				}
			} catch {
				status = 'disconnected';
				scheduleReconnect();
				return;
			} finally {
				clearTimeout(timeout);
			}
		}

		socket = new WebSocket(getSocketUrl(socketUrl));

		socket.addEventListener('open', () => {
			status = 'connected';
			socket?.send(
				JSON.stringify({
					type: 'join',
					payload: {
						roomId: 'ngl-home',
						name: identity.name,
						color: identity.color,
						x: 0.5,
						y: 0.5,
						isTouching: false,
						pagePath: '/ngl',
						pageLabel: 'NGL',
						sectionId: null,
						sectionLabel: null
					}
				})
			);

			heartbeatId = setInterval(() => {
				socket?.send(JSON.stringify({ type: 'ping' }));
			}, HEARTBEAT_MS);
		});

		socket.addEventListener('message', (event) => {
			try {
				const message = JSON.parse(String(event.data)) as PresenceMessage;
				if (message.type === 'welcome') {
					selfId = message.payload.selfId;
					return;
				}
				if (message.type === 'overview') {
					participants = message.payload.participants
						.slice()
						.sort((a, b) => a.pageLabel.localeCompare(b.pageLabel) || a.name.localeCompare(b.name));
				}
			} catch {
				// Ignore invalid frames.
			}
		});

		socket.addEventListener('close', () => {
			status = 'disconnected';
			socket = null;
			scheduleReconnect();
		});

		socket.addEventListener('error', () => {
			status = 'disconnected';
		});
	}

	onMount(() => {
		void connect();

		return () => {
			shouldReconnect = false;
			clearTimers();
			if (socket?.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ type: 'leave' }));
			}
			socket?.close();
		};
	});
</script>

<div
	class="fixed right-4 top-5 z-[52] flex justify-end px-4 md:right-6 md:top-6 md:px-0 lg:left-6 lg:right-auto lg:top-auto lg:bottom-8"
>
	<div class="pointer-events-auto flex flex-col items-end gap-3 lg:items-start">
		<button
			type="button"
			on:click={() => (isOpen = !isOpen)}
			class="inline-flex max-w-[calc(100vw-2.5rem)] items-center justify-center gap-2 rounded-full border border-white/60 bg-[linear-gradient(150deg,rgba(247,250,255,0.82),rgba(231,239,249,0.72))] px-2.5 py-1.5 text-[10px] font-semibold text-[#475569] shadow-[10px_10px_24px_rgba(163,177,198,0.16),-10px_-10px_24px_rgba(255,255,255,0.48)] backdrop-blur-xl transition-transform duration-200 hover:-translate-y-0.5 md:max-w-[260px] md:px-4 md:py-2 md:text-[11px]"
		>
			<span
				class="inline-flex items-center gap-2 rounded-full bg-white/72 px-2 py-1 shadow-[inset_2px_2px_4px_rgba(163,177,198,0.18),inset_-2px_-2px_4px_rgba(255,255,255,0.55)] md:px-2.5"
			>
				<span
					class={`h-2.5 w-2.5 rounded-full ${status === 'connected' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.75)]' : status === 'connecting' ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.65)]' : 'bg-slate-300 shadow-none'}`}
				></span>
				<span class="md:hidden">{participants.length} Online</span>
				<span class="hidden md:inline">{participants.length} Online</span>
			</span>
		</button>

		{#if isOpen}
			<div
				class="w-[min(92vw,360px)] rounded-[24px] border border-white/65 bg-[linear-gradient(160deg,rgba(248,251,255,0.94),rgba(233,240,249,0.88))] p-3 shadow-[18px_18px_36px_rgba(163,177,198,0.2),-18px_-18px_36px_rgba(255,255,255,0.52)] backdrop-blur-xl"
			>
				<div class="mb-2 flex items-center justify-between px-1">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">Live now</p>
						<p class="text-sm font-semibold text-[#334155]">Shared portfolio presence</p>
					</div>
					<span
						class="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-[#3B82F6] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.18),inset_-2px_-2px_4px_rgba(255,255,255,0.55)]"
						>{participants.length}</span
					>
				</div>

				<div class="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
					{#each participants as participant (participant.id + participant.pageLabel)}
						<div
							class="flex items-start justify-between gap-3 rounded-[18px] border border-white/55 bg-white/75 px-3 py-2.5 shadow-[10px_10px_20px_rgba(163,177,198,0.12),-10px_-10px_20px_rgba(255,255,255,0.42)]"
						>
							<div class="min-w-0">
								<div class="flex items-center gap-2">
									<span class="h-2.5 w-2.5 rounded-full" style={`background:${participant.color}`}
									></span>
									<p class="truncate text-sm font-semibold text-[#334155]">{participant.name}</p>
								</div>
								<p class="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#64748B]">
									{participant.pageLabel}
								</p>
								<p class="mt-1 text-xs text-[#475569]">
									{participant.sectionLabel || 'Browsing page'}
								</p>
							</div>
							{#if participant.id === selfId}
								<span
									class="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-600"
									>Here</span
								>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
