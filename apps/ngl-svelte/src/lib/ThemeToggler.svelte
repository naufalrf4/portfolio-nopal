<script lang="ts">
	/**
	 * Same circular clip-path reveal as public-astro's AnimatedThemeToggler.
	 * Theme is driven by `data-theme` on <html> + localStorage('theme')
	 * (inline init script lives in app.html).
	 */
	const THEME_KEY = 'theme';
	const DURATION = 550;

	let isDark = $state(true);
	let buttonEl: HTMLButtonElement | null = $state(null);
	let isTransitioning = false;

	$effect(() => {
		const update = () => {
			isDark = document.documentElement.dataset.theme !== 'light';
		};
		update();
		const observer = new MutationObserver(update);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-theme']
		});
		return () => observer.disconnect();
	});

	function applyTheme() {
		const next = isDark ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		isDark = next === 'dark';
		try {
			localStorage.setItem(THEME_KEY, next);
		} catch {
			/* private mode */
		}
	}

	function toggleTheme() {
		if (!buttonEl || isTransitioning) return;

		if (typeof document.startViewTransition !== 'function') {
			applyTheme();
			return;
		}

		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const rect = buttonEl.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;
		const maxRadius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));

		isTransitioning = true;
		const transition = document.startViewTransition(applyTheme);
		transition.finished
			.finally(() => {
				isTransitioning = false;
			})
			.catch(() => {});

		transition.ready
			.then(() => {
				document.documentElement.animate(
					{ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
					{
						duration: DURATION,
						easing: 'ease-in-out',
						fill: 'forwards',
						pseudoElement: '::view-transition-new(root)'
					}
				);
			})
			.catch(() => {});
	}
</script>

<button
	type="button"
	bind:this={buttonEl}
	onclick={toggleTheme}
	aria-label="Toggle theme"
	class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors duration-300 hover:bg-bg-elevated hover:text-teal"
>
	<span class="relative block h-[18px] w-[18px] overflow-hidden">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="absolute inset-0 h-[18px] w-[18px] transition-all duration-300 {isDark
				? 'translate-y-0 rotate-0 opacity-100'
				: '-translate-y-3 rotate-90 opacity-0'}"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
		</svg>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="absolute inset-0 h-[18px] w-[18px] transition-all duration-300 {!isDark
				? 'translate-y-0 rotate-0 opacity-100'
				: 'translate-y-3 -rotate-90 opacity-0'}"
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	</span>
	<span class="sr-only">Toggle theme</span>
</button>
