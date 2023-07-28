<script>
	// @ts-nocheck

	export let data;
	import { db } from '$lib/firebaseConfig';
	import FullJobCard from '$lib/FullJobCard.svelte';
	import { _jobs_searched, _lastVisible_search } from '$lib/stores.js';
	import { removeSymbols } from '$lib/utils';
	import { toast } from 'svelte-sonner';

	import {
		query,
		collection,
		orderBy,
		where,
		startAfter,
		limit,
		getDocs
	} from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	let loading = false;
	let jobs;
	let order = 'created';

	async function getJobs(searchParams) {
		console.log(searchParams);
		loading = true;
		let j = [];
		let q = query(
			collection(db, 'jobs'),
			where('searchParams', 'array-contains-any', searchParams),
			orderBy(order),
			startAfter($_lastVisible_search),
			limit(50)
		);
		if (!$_lastVisible_search) {
			q = query(
				collection(db, 'jobs'),
				where('searchParams', 'array-contains-any', searchParams),
				orderBy(order),
				limit(50)
			);
		} else {
			q = query(
				collection(db, 'jobs'),
				where('searchParams', 'array-contains-any', searchParams),
				orderBy(order),
				startAfter($_lastVisible_search),
				limit(50)
			);
		}

		//Execute Query
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			$_jobs_searched = [...$_jobs_searched, { ...doc.data(), id: doc.id }];
		});
		if (querySnapshot.docs.length > 0) {
			$_lastVisible_search = querySnapshot.docs[querySnapshot.docs.length - 1];
		} else {
			toast('Nothing to show!');
		}
		loading = false;
		return j;
	}

	let search_query = removeSymbols(data.query).trim().toLowerCase().split(' ');

	onMount(() => {
		_jobs_searched.set([]);
		_lastVisible_search.set(null);
		jobs = getJobs(search_query);
	});
</script>

<div in:fly={{ y: 200 }}>
	<p class="p-2 text-lg">
		Looking for <span class="font-bold text-primary">{data?.query}</span> jobs
	</p>

	<div class="flex flex-row justify-between gap-2 p-4 mb-2 bg-base-200 rounded-md">
		<span class="opacity-80">Order by </span>

		<select
			class="select select-primary select-sm capitalize"
			bind:value={order}
			on:change={() => {
				_jobs_searched.set([]);
				jobs = getJobs(search_query);
			}}
		>
			{#each ['created', 'deadline'] as filter}
				<option value={filter}><span>{filter}</span></option>
			{/each}
		</select>
	</div>

	{#await jobs}
		<div class="space-y-2 flex flex-col">
			{#each { length: 5 } as c}
				<div class="h-44 rounded-lg bg-base-200 animate-pulse" />
			{/each}
		</div>
	{:then jobs}
		<div class="space-y-2">
			{#if $_jobs_searched.length == 0}
				<div class="h-[70vh] flex flex-col gap- justify-center items-center">
					<p class="text-center text-2xl">😞</p>
					<p class="text-xl font-semibold mt-4">Sorry</p>
					<p>No Jobs found that match your Query!</p>
					<div class="divider" />
					<button
						class="btn btn-ghost normal-case text-primary"
						on:click={() => {
							history.back();
						}}>Go Back</button
					>
				</div>
			{:else}
				{#each $_jobs_searched as job}
					<FullJobCard {job} />
				{/each}
				<div class="flex flex-row justify-center my-2">
					<button
						disabled={loading}
						class="btn btn-ghost normal-case"
						on:click={async () => {
							let b = await getJobs(search_query);
						}}
					>
						{#if loading}
							<svg
								class="animate-spin h-4 w-4"
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
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Loading...
						{:else}
							Load More Jobs
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/await}
</div>
