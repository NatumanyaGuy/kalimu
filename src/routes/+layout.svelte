<script>
	// @ts-nocheck
	import TopNav from '$lib/TopNav.svelte';
	import { fade } from 'svelte/transition';
	import '../app.css';
	import { Toaster, toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { _user } from '$lib/localStore';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	let lastScrollTop; //last scroll position
	$: showNav = true; //boolean to show or hide nav bar
	$: _page = $page.route.id;
	$: theme = 'light';
	$: splashScreen = true;

	onMount(async () => {
		themeChange(false);

		if (browser) {
			//Get Theme
			let html = document.querySelector('html');
			theme = html.getAttribute('data-theme');
		}

		setTimeout(() => {
			splashScreen = false;
		}, 2000);
	});
</script>

<svelte:window
	on:scroll={() => {
		var st = window.pageYOffset || document.documentElement.scrollTop; //Get current scroll position
		//If new scroll position is greater than old (previous/ last) - hide
		if (st > lastScrollTop) showNav = false;
		else showNav = true;
		lastScrollTop = st;
	}}
/>

{#if $navigating}
	<div class="relative" in:fade>
		<div
			class="w-screen h-[100vh] flex justify-center items-center bg-base-300 opacity-90 top-0 left-0 fixed z-[100000000]"
		>
			<svg
				class="animate-spin h-6 w-6 text-primary"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		</div>
	</div>
{/if}

{#if !splashScreen}
	{#if showNav && _page == '/'}
		<!-- Top Nav  -->
		<TopNav />
	{/if}

	<Toaster theme="dark" />
	<main class="p-3 {_page == '/' ? 'mt-16' : ''}" in:fade>
		<!-- <p>{JSON.stringify(pp)}</p> -->
		<slot />
	</main>
{:else}
	<div class="flex h-[90vh] justify-center items-center">
		<img
			src={theme == 'dark' ? '/logo-dark.png' : '/logo.png'}
			class="h-12 w-auto animate-pulse"
			alt=""
		/>
	</div>
{/if}
