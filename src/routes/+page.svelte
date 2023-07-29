<script>
	// @ts-nocheck
	import FullJobCard from '$lib/FullJobCard.svelte';
	import { _jobs, _lastVisible } from '$lib/stores';
	import { onMount } from 'svelte';
	import { db } from '$lib/firebaseConfig';
	import {
		query,
		collection,
		orderBy,
		where,
		startAfter,
		limit,
		getDocs
	} from 'firebase/firestore';
	import { toast } from 'svelte-sonner';
	let loading = false;

	// let lastVisible = null;
	let jobs = [];
	let order = 'created';

	async function getJobs() {
		let c = "desc"
	if(order == "deadline"){
		c = 'asc'
	}else{
		c = 'desc'
	}

		loading = true;
		let j = [];
		let q = query(collection(db, 'jobs'));
		if (!$_lastVisible) {
			q = query(collection(db, 'jobs'), orderBy(order, c), limit(50));
		} else {
			q = query(collection(db, 'jobs'), orderBy(order, c), startAfter($_lastVisible), limit(50));
		}

		//Execute Query
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			$_jobs = [...$_jobs, { ...doc.data(), id: doc.id }];
		});
		if (querySnapshot.docs.length > 0) {
			$_lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
		} else {
			toast('Nothing to show!');
		}
		loading = false;
		return j;
	}

	onMount(() => {
		if ($_jobs.length == 0) {
			jobs = getJobs([]);
		} else {
			return;
		}
	});
	$: _job = {};
</script>

<div class="flex flex-row justify-between gap-2 p-4 mb-2 bg-base-200 rounded-md">
	<span class="opacity-80">Order by </span>

	<select
		class="select select-primary select-sm capitalize"
		bind:value={order}
		on:change={() => {
			_jobs.set([]);
			_lastVisible.set(null)
			jobs = getJobs([]);
		}}
	>
		{#each ['created', 'deadline'] as filter}
			<option value={filter}><span>{filter}</span></option>
		{/each}
	</select>
</div>

{#await jobs}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each { length: 5 } as c}
			<div class="h-44 rounded-lg bg-base-200 animate-pulse" />
		{/each}
	</div>
{:then jobs}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#each $_jobs as job}
			<FullJobCard
				{job}
				on:preview={() => {
					document.getElementById('about_employer').showModal();
					_job = job;
				}}
				on:favorite={() => {}}
			/>
		{/each}
	</div>

	<div class="flex flex-row justify-center my-2">
		<button
			disabled={loading}
			class="btn btn-ghost normal-case"
			on:click={async () => {
				await getJobs();
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
{/await}

<!-- Modal About Employer -->
<dialog id="about_employer" class="modal modal-bottom sm:modal-middle">
	<form
		method="dialog"
		class="modal-box"
		style="background-color: {_job?.bg_color}; color:{_job?.text_color}"
	>
		<!-- <p>{_job?.employer}</p> -->
		<div class="flex flex-row gap-3">
			<div class="basis-3/4">
				<p class="text-xl capitalize font-bold py-4">
					{_job?.employer}
				</p>
			</div>

			<div class="basis-1/4">
				<img
					src={_job?.employer_logoURL}
					class="h-auto
			object-contain
			 w-full"
					alt=""
				/>
			</div>
		</div>

		<div class="divider py-0 my-0" />

		<p class="text-sm font-light line-clamp-6 mt-3">
			{_job?.employer_about}
		</p>

		<div class="modal-action">
			<!-- if there is a button in form, it will close the modal -->
			<button
				class="btn btn-ghost shadow-2xl w-full normal-case"
				style="border: {_job?.bg_color} 2px solid;">Close</button
			>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button >close</button>
	</form>
</dialog>
