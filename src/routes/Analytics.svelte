<script lang="ts">
	import { page } from '$app/stores';

	$: {
		if (typeof gtag !== 'undefined') {
			gtag('config', 'G-79NRWRJ74L', {
				page_title: document.title,
				page_path: $page.url.pathname
			});
		}
	}
</script>

<svelte:head>
	<title>Podcast mp3 downloader</title>
	<meta name="description" content="Download the mp3 files from apple podcasts" />
	<meta name="keywords" content="Podcast Download mp3" />
	<meta name="author" content="Fulco" />
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-79NRWRJ74L">
	</script>
	<script>
		window.dataLayer = window.dataLayer || [];

		function gtag() {
			dataLayer.push(arguments);
		}

		gtag('js', new Date());
		gtag('config', 'G-79NRWRJ74L');
	</script>
</svelte:head>
