<script>
	// @ts-nocheck
	import { createEventDispatcher, onMount } from 'svelte';
	import { query, where, collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebaseConfig';

	let employers = [];

	//Get Employers
	async function searchEmployers(searchQuery) {
		const employerRef = collection(db, 'employers');

		let searchArr = searchQuery.trim().toLowerCase().split(' ');
		let employers = [];
		const q = query(employerRef, where('searchParams', 'array-contains-any', searchArr));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			employers = [...employers, doc.data()];
		});
		return employers;
	}

	onMount(() => {});

	const dispatch = createEventDispatcher();
	let dropdown;
	export let employer = '';

	//New Employer
	import Drawer from 'svelte-drawer-component';
	import NewEmployer from './NewEmployer.svelte';
	import { fade } from 'svelte/transition';
	let open = false;
</script>

<div>
	<div class="dropdown dropdown-bottom w-full">
		<div
			class="flex flex-row border-2 border-primary rounded-lg p-2 justify-center items-center focus-within:border-2 focus-within:border-primary-focus"
		>
			<input
				tabindex="0"
				type="text"
				bind:value={employer}
				placeholder="Find Employer"
				on:keyup={(e) => {
					if (e.key == 'Enter') {
						employers = searchEmployers(employer);
					}
				}}
				class="input text-xl input-lg focus:outline-none grow-[2] border-none w-full"
			/>
			<button
				class="btn btn-primary normal-case"
				on:click={() => {
					employers = searchEmployers(employer);
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-4 h-4"
				>
					<path
						fill-rule="evenodd"
						d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
						clip-rule="evenodd"
					/>
				</svg>
				Search</button
			>
		</div>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			tabindex="0"
			bind:this={dropdown}
			on:click={() => {
				dropdown.blur();
			}}
			class="dropdown-content z-[1] p-2
        overflow-auto
        flex flex-col
        bg-primary text-primary-content rounded-md w-full min-h-[20vh] max-h-[35vh]"
		>
			{#await employers}
				<div class="flex h-[12vh] justify-center items-center" in:fade>
					<svg
						class="animate-spin h-8 w-8 text-primary-content"
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
				</div>
			{:then employers}
				{#if employer.length == 0 && employers.length == 0}
					<div class="my-10 opacity-50">
						<p class="text-center text-xl">Please search for an employer</p>
					</div>
				{:else}
					{#each employers as loc}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div
							in:fade
							class="py-3 px-1 border-b-2 flex flex-row justify-between border-base-300 cursor-pointer
				hover:bg-primary-focus text-primary-content"
							on:click={() => {
								employer = loc.name;
								dispatch('select', {
									employer: loc
								});
							}}
						>
							<span class="m-2">{loc.name}</span>
							<div
								class="p-2 rounded-lg"
								style="background-color: {loc.palatte?.bg || '#fff'}; color: {loc.palatte?.text ||
									'#eee'}"
							>
								<img src={loc.logoURL} class="h-10 w-10" alt="" />
							</div>
						</div>
					{/each}
				{/if}
			{/await}

			<div>
				<button class="btn btn-ghost normal-case w-full btn-lg" on:click={() => (open = true)}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
						/>
					</svg>
					New Organization
				</button>
			</div>
		</div>
	</div>
</div>

<!-- New Employer  -->
<Drawer
	{open}
	size="45vw"
	placement="right"
	on:clickAway={() => {
		open = false;
	}}
>
	<div class="bg-base-100 w-full min-h-[90vh] p-8">
		<NewEmployer
			on:close={() => {
				open = false;
			}}
			on:success={(e) => {
				let loc = e.detail.employer;
				employer = loc.name;
				dispatch('select', {
					employer: loc
				});
				open = false;
			}}
		/>
	</div>
</Drawer>
