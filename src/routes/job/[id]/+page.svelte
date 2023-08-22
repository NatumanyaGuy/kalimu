<script>
	// @ts-nocheck

	import JobCard from '$lib/JobCard.svelte';

	export let data;
	// console.log(data);
	let job = data.job;
</script>



<svelte:head>
	<title>Kalimu</title>
	<meta name="title" content="Kalimu" />
	<meta
		name="description"
		content={`${job?.position} + ' at ' + ${job?.employer}. Kalimu - Discover exciting career opportunities.`}
	/>
	<meta property="og:title" content={`${job?.position} + ' at ' + ${job?.employer}`} />
	<meta property="og:site_name" content="Kalimu" />
	<meta property="og:url" content={window.location} />
	<meta property="og:description" content="Kalimu - Discover exciting career opportunities." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content={job?.employer_logoURL} />
</svelte:head>


<div class="flex lg:flex-row-reverse flex-col gap-4">
	<div class="basis-1/3">
		<JobCard {job} />
	</div>

	<div class="basis-2/3 p-4 mt-4 rounded-lg bg-base-100 shadow" id="tip_tap">
		{@html job?.details}
	</div>
</div>
