<script>
	// @ts-nocheck
	import Wave from '$lib/SVGs/Wave.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { _user } from '$lib/localStore';

	$: display_name = '';
	$: avatar_url = '';
	let closeBtn;
	$: searching = false;
	let query;

	let _page = $page.route.id;
</script>

<div
	class="navbar fixed bg-primary text-primary-content rounded-none pb-3 top-0 shadow right-0 z-50 w-full"
>
	<button
		class="flex-1"
		on:click={() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}}
	>
		<img src="/logo-dark.png" class="h-8 w-auto" alt="" />
	</button>

	<!-- <div class="flex-1">
		<div class="text-xl flex gap-1 ml-5">
			Hello <span class="font-extrabold">{!$_user?.name ? '' : $_user?.name}</span>
			<Wave class="w-5 h-5" />
		</div>
	</div> -->
	<div class="flex-none gap-1">
		<button
			class="btn btn-ghost btn-circle"
			onclick="search_modal.showModal()"
			on:click={() => {
				searching = true;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		{#if $_user?.photo != undefined}
			<a href="/profile" class="btn btn-circle btn-ghost">
				<div class="avatar">
					<div class="w-12 mask mask-squircle">
						<img src={!$_user?.photo ? '' : $_user?.photo} alt={display_name} />
					</div>
				</div>
			</a>
		{:else}
			<a href="/profile" class="btn btn-circle btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-12 h-12 text-base-100"
				>
					<path
						fill-rule="evenodd"
						d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</a>
		{/if}
	</div>
</div>

<!-- User Profile -->

<!-- Search -->

<dialog id="search_modal" class="modal modal-bottom sm:modal-middle">
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg text-center">Find a Job</h3>
		<div class="py-2 flex flex-row justify-center">
			<div class="join w-full mx-auto">
				<input class="input input-bordered join-item w-full" bind:value={query} placeholder="" />
				<button
					class="btn btn-primary join-item"
					on:click={() => {
						searching = false;
						goto('/search/' + query);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						class="w-6 h-6"
					>
						<path
							d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button
			bind:this={closeBtn}
			>close</button
		>
	</form>
</dialog>
