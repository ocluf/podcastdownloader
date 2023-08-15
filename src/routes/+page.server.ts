import type { PageServerLoad } from './$types';
import Parser from 'rss-parser';

export const load = (async ({ url, fetch }) => {
	const topPodcasts = await fetch(
		'https://rss.applemarketingtools.com/api/v2/us/podcasts/top/10/podcasts.json'
	);

	let data = { topPodcasts: topPodcasts.json() };
	const parser = new Parser();
	const rssUrl = url.searchParams.get('rss');
	if (rssUrl === null) {
		return data;
	}
	try {
		// Parse the RSS feed from the provided URL
		const feed = await parser.parseURL(decodeURIComponent(rssUrl));
		const mappedItems = feed.items.map((item) => ({
			title: item.title,
			link: item.link,
			pubDate: item.pubDate,
			enclosure: item.enclosure
		}));

		// Return the title of the RSS feed as the response
		return { ...feed, items: mappedItems, ...data };
	} catch (error) {
		// Handle any errors that occur during parsing
		throw new Error('Error parsing RSS feed: ' + error.message);
	}
}) satisfies PageServerLoad;
