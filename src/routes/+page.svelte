<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	export let data: PageData;

	let result = data.topPodcasts?.feed || {};
	let searchTerm = '';

	function handleKeydown(event: { key: string }) {
		if (event.key === 'Enter') {
			searchAndSet();
		}
	}

	function formatDate(dateString: string | undefined) {
		if (!dateString) return '';
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString();
		} catch (error) {
			return '';
		}
	}

	async function goToPodcastPage(id: string) {
		try {
			const searchResult = await searchPodcasts(id);
			const podcast = searchResult.results[0].feedUrl;
			goto('/?rss=' + encodeURIComponent(podcast));
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	}

	async function searchAndSet() {
		result = await searchPodcasts(searchTerm);
	}

	async function searchPodcasts(searchTerm: string) {
		const baseURL = 'https://itunes.apple.com/search';
		const mediaType = 'podcast';
		const limit = 20; // Number of search results you want

		// Construct the URL parameters
		const parameters = [
			`term=${encodeURIComponent(searchTerm)}`,
			`media=${mediaType}`,
			`limit=${limit}`
		];

		const searchURL = `${baseURL}?${parameters.join('&')}`;

		try {
			const response = await fetch(searchURL);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching search results:', error);
			return {};
		}
	}

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};
</script>

<svelte:head>
	<title>Podcast mp3 downloader</title>
	<meta name="description" content="Download the mp3 files from apple podcasts" />
	<meta name="keywords" content="Podcast Download mp3" />
	<meta name="author" content="Fulco" />
</svelte:head>
<div class="card p-4 max-w-[300px] variant-filled-surface-100 z-[1000]" data-popup="popupHover">
	<h1>With Chrome</h1>
	<p>On the audio element simply click the 3 dots and click download</p>
	<h1 class="mt-4">Safari</h1>
	<p>
		First click play on the podcast that you want to download. Then right mouse click on the play
		icon and select "Download audio". <br />

		<span class="text-sm text-gray-500"
			>(sometimes it might say "download video" then select that it will download an audio file)</span
		>
	</p>
	<div class="arrow variant-filled-surface-100" />
</div>
<div class="max-w-[1000px] px-2 mx-auto pb-8">
	<header
		class="card-with-opacity grid grid-cols-[auto,1fr] gap-4 items-center rounded-xl card-with-opacity h-20 m-2"
	>
		<a href="/" class="p-2 ml-4 rounded-xl w-fit -mt-1 text-xl font-bold bg-surface-200">
			Podcast downloader
		</a>
		<p>Download the mp3 files of shows hosted on apple podcasts</p>
	</header>
	{#if data.items}
		<div class="card-with-opacity bg-surface-200 shadow p-6 m-2 rounded-xl">
			<div class="flex flex-col md:flex-row items-center">
				{#if data?.image?.url}
					<img
						src={data.image.url}
						alt={data.title}
						class="w-24 h-24 rounded-full mb-4 md:mb-0 md:mr-6"
					/>
				{/if}
				<div>
					<h1 class="text-3xl font-bold mb-2">{data?.title || 'Podcast Title'}</h1>
					<p class="text-md mb-2">{data?.description || 'Podcast description...'}</p>

					{#if data?.link}
						<a
							href={data.link}
							class="text-blue-400 hover:underline"
							target="_blank"
							rel="noopener"
						>
							Visit Podcast Website
						</a>
					{/if}

					{#if data?.itunes?.owner?.name}
						<div class="text-sm mt-2">Owner: {data.itunes.owner.name}</div>
					{/if}

					{#if data?.itunes?.categories && data?.itunes?.categories.length}
						<div class="text-sm mt-2">
							Category: {data.itunes.categories.join(', ')}
						</div>
					{/if}
				</div>
			</div>
		</div>
		<div class="grid gap-2 p-2">
			{#each data.items as item}
				<div class="py-2 px-4 card-with-opacity grid grid-cols-3">
					<div>
						<div class="font-bold mb-2">
							<h2>{item.title}</h2>
						</div>
						<div class="text-sm text-gray-600">
							Published Date: {formatDate(item.pubDate)}
						</div>
					</div>

					<audio controls preload="none" class="m-auto w-[300px]">
						<source src={item.enclosure?.url} type="audio/mpeg" />
						Your browser does not support the audio element.
					</audio>
					<div class="m-auto">
						<button class="flex space-x-2 [&>*]:pointer-events-none" use:popup={popupHover}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
								/>
							</svg>
							<div>How to download?</div>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div>
			<div class="flex p-4 space-x-2">
				<input
					class="input"
					bind:value={searchTerm}
					title="Search"
					type="text"
					placeholder="Search for your podcast"
					on:keydown={handleKeydown}
				/>
				<button class="btn variant-filled-primary" on:click={searchAndSet}>Search</button>
			</div>

			{#if result.results && result.results.length > 0}
				<div class="grid grid-cols-1 gap-4 px-4">
					{#each result.results as podcast}
						<div class="card-with-opacity p-4 grid grid-cols-[auto_1fr]">
							<div class="mr-4">
								<img
									class="w-24 h-24 mt-2 shadow rounded"
									src={podcast.artworkUrl100}
									alt={podcast.trackName}
								/>
							</div>
							<div>
								<h2 class="text-lg font-bold">{podcast.trackName || podcast.name}</h2>
								<p class="text-sm mt-2">
									<strong>By:</strong>

									{podcast.artistName}
								</p>
								<p class="text-sm mt-1">
									<strong>Genre:</strong>
									{podcast.primaryGenreName || podcast.genres[0].name}
								</p>
								{#if podcast.releaseDate}
									<p class="text-sm mt-1">
										<strong>Release Date:</strong>
										{new Date(podcast.releaseDate).toLocaleDateString()}
									</p>
								{/if}
								{#if podcast.country}
									<p class="text-sm mt-1"><strong>Country:</strong> {podcast.country}</p>
								{/if}
								<p class="ml-auto mt-2">
									{#if podcast.feedUrl}
										<a
											href={'/?rss=' + encodeURIComponent(podcast.feedUrl)}
											class="text-blue-500 hover:underline"
										>
											Go to downloads page
										</a>
									{:else}
										<button
											on:click={() => goToPodcastPage(podcast.id)}
											class="text-blue-500 hover:underline"
										>
											Go to downloads page
										</button>
									{/if}
								</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.card-with-opacity {
		position: relative;
	}

	.card-with-opacity::after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: 0.75rem;
		background-color: rgba(255, 255, 255, 0.7); /* This will give white color with 70% opacity */
		z-index: -1;
	}
</style>
