<script>
	// @ts-nocheck

	import { fade } from 'svelte/transition';
	import { _user } from '$lib/localStore';
	import { auth } from '$lib/firebaseConfig';
	import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	// NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	onMount(() => {
		themeChange(false);
		// 👆 false parameter is required for svelte
	});

	let signing = false;
	const provider = new GoogleAuthProvider();
	provider.setCustomParameters({
		prompt: 'select_account'
	});

	async function signInGoogle() {
		signing = true;
		signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GoogleAuthProvider.credentialFromResult(result);
				// const token = credential.accessToken;
				const user = result.user;
				_user.set({
					name: user.displayName,
					email: user.email,
					photo: user.photoURL
				});
				signing = false;
			})
			.catch((error) => {
				const errorMessage = error.message;
				signing = false;
				toast(errorMessage);
			});
	}
</script>

<div in:fade class="">
	<div class="flex flex-row justify-between">
		<button
			class="btn btn-circle btn-ghost"
			on:click={() => {
				history.back();
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-6 h-6"
			>
				<path
					fill-rule="evenodd"
					d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<label class="swap swap-rotate btn btn-ghost btn-circle">
			<!-- this hidden checkbox controls the state -->
			<input type="checkbox" data-toggle-theme="dark,light" data-act-class="ACTIVECLASS" />
			<!-- sun icon -->
			<svg
				class="swap-on fill-current w-6 h-6"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				><path
					d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
				/></svg
			>
			<!-- moon icon -->
			<svg
				class="swap-off fill-current w-6 h-6"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				><path
					d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
				/></svg
			>
		</label>
	</div>

	{#if !$_user}
		<p class="text-xl text-center">Sign In</p>

		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="p-10 lg:px-96">
			<!-- Google Sign In  -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="bg-[#4285F4] p-3 text-primary-content rounded-xl text-xl normal-case"
				on:click={() => {
					signInGoogle();
					// toast(
					// 	'Google Authentication Not Available yet! \nYou can still search for jobs. \nGood Luck finding your Dream Job'
					// );
				}}
			>
				{#if signing}
					<div class="flex flex-col gap-4 text-center">
						<svg
							class="animate-spin h-10 w-10 mx-auto mt-4"
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
						<p class="mb-2">Signing In...</p>
					</div>
				{:else}
					<div class="flex flex-col gap-4 text-center">
						<svg
							role="img"
							viewBox="0 0 24 24"
							class="h-10 w-10 mx-auto mt-4 fill-white"
							xmlns="http://www.w3.org/2000/svg"
							><title>Google</title><path
								d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
							/></svg
						>
						<p class="mb-2">Sign In with Google</p>
					</div>
				{/if}
			</div>

			<br />

			<!-- Sign In with Apple  -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="bg-[#000000] p-3 text-primary-content rounded-xl text-xl normal-case"
				on:click={() => {
					toast(
						'Apple Authentication Not Available yet! \nYou can still search for jobs. \nGood Luck finding your Dream Job'
					);
				}}
			>
				<div class="flex flex-col gap-4 text-center">
					<svg
						role="img"
						viewBox="0 0 24 24"
						class="h-10 w-10 mx-auto mt-4 fill-white"
						xmlns="http://www.w3.org/2000/svg"
						><title>Apple</title><path
							d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
						/></svg
					>
					<p class="mb-2">Sign In with Apple</p>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-row py-8 justify-center">
			<img src={$_user?.photo} alt="" />
		</div>
		<p class="text-2xl text-center">{$_user.name}</p>
		<p class="text-xl opacity-80 text-center">{$_user.email}</p>
		<div class="my-6 flex flex-row justify-center">
			<button
				class="btn btn-ghost normal-case shadow-xl text-primary btn-lg"
				on:click={() => {
					signOut(auth)
						.then(() => {
							// Sign-out successful.
							_user.set(null);
						})
						.catch((error) => {
							// An error happened.
							toast.error('Error Signing out!');
						});
				}}>Sign Out</button
			>
		</div>
	{/if}
</div>

<!-- Footer -->
<div
	class="bottom-0 left-0 w-full p-3 fixed border-t-2 border-base-200 shadow-2xl"
	in:fade={{ delay: 2000 }}
>
	<p class="text-center">Kalimu</p>
</div>
