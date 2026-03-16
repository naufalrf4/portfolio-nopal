<script lang="ts">
	import { env } from '$env/dynamic/public';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	const title = 'Anonymous Message - NaufalRF';
	const description =
		'Send anonymous messages, feedback, or questions to Naufal Rizqullah Firdaus regarding his work, projects, or engineering approach in a safe and open way.';
	const canonicalUrl = 'https://ngl.naufalrf.tech';
	const ogDescription =
		'An open space to share feedback or questions anonymously with Naufal Rizqullah Firdaus to support transparency and continuous improvement.';
	const PUBLIC_GA_MEASUREMENT_ID = env.PUBLIC_GA_MEASUREMENT_ID ?? '';

	let { children } = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="icon" href={favicon} />
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="Anonymous Message Portfolio, Feedback Software Engineer, NGL Developer Page"
	/>
	<meta name="author" content="Naufal Rizqullah Firdaus" />
	<meta name="creator" content="Naufal Rizqullah Firdaus" />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:site_name" content="NaufalRF NGL" />
	<meta property="og:title" content="Anonymous Messages for NaufalRF" />
	<meta property="og:description" content={ogDescription} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:creator" content="@naufalrf" />
	<meta name="twitter:title" content="Anonymous Messages for NaufalRF" />
	<meta name="twitter:description" content={ogDescription} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
	{#if PUBLIC_GA_MEASUREMENT_ID}
		<script async src={`https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_MEASUREMENT_ID}`}></script>
		<script>
			{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${PUBLIC_GA_MEASUREMENT_ID}', { send_page_view: false });`}
		</script>
	{/if}
</svelte:head>

<div class="ngl-root">
	{@render children()}
</div>
