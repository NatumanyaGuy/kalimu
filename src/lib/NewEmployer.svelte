<script>
	//@ts-nocheck
	import { fade } from 'svelte/transition';
	import { extractColors, removeSymbols } from '$lib/utils';
	import { storage, db } from '$lib/firebaseConfig';
	import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
	import { toast } from 'svelte-sonner';
	import { collection, addDoc } from 'firebase/firestore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let newEmployer = {
		name: '',
		website: '',
		about: '',
		palatte: '',
		logoURL: ''
	};

	let input;
	let imageFile;
	let image;
	let showImage = false;
	let palatte = [];
	let loading = false;

	async function onChange() {
		loading = true;
		imageFile = input.files[0];

		if (imageFile) {
			showImage = true;

			const reader = new FileReader();
			reader.addEventListener('load', function () {
				extractColors(reader.result, 4, (p) => {
					image.setAttribute('src', reader.result);
					newEmployer.palatte = p[0];
					palatte = p;
					loading = false;
				});
			});
			reader.readAsDataURL(imageFile);
			return;
		}
		showImage = false;
	}

	//Upload Image
	async function uploadImage(file) {
		try {
			// Create a storage reference with a unique filename
			const filename = Date.now() + '_' + file.name;
			const storageRef = ref(storage, 'images/' + filename);
			// Upload the file to Firebase Storage
			const snapshot = await uploadBytes(storageRef, file);
			// Get the download URL for the uploaded file
			const downloadURL = await getDownloadURL(snapshot.ref);
			// Return the download URL
			return downloadURL;
		} catch (error) {
			// Handle any errors that occur during the upload process
			console.error('Error uploading image:', error);
			toast.error('Error Uploading Logo');
			throw error;
		}
	}

	//Save Employer
	let saving = false;
	async function saveEmployer() {
		saving = true;
		try {
			//Upload Image;
			const downloadURL = await uploadImage(imageFile);
			newEmployer.logoURL = downloadURL;
			newEmployer.searchParams = removeSymbols(newEmployer.name).trim().toLowerCase().split(' ');
			const docRef = await addDoc(collection(db, 'employers'), newEmployer);
			console.log('Document written with ID: ', docRef.id);
			toast.success('Employer saved successfully');
			dispatch('success', {
				employer: newEmployer
			});
			saving = false;
		} catch (error) {
			console.error(error);
			toast.error('Error saving employer');
			saving = false;
		}
	}
</script>

<input disabled={saving} bind:this={input} on:change={onChange} type="file" class="hidden" />
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if showImage}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		class="bg-base-200 rounded-md shadow-sm {loading ? ' h-[18rem] bg-base-300 animate-pulse' : ''}"
		in:fade
	>
		<img
			bind:this={image}
			on:click={() => {
				input.click();
			}}
			src=""
			class="max-h-[18rem] w-full h-auto object-contain shadow {loading ? ' opacity-0' : ''}"
			alt="Preview"
		/>

		<!-- Color Palattes  -->
		<div class="flex justify-center pb-3 bg-base-300 {loading ? ' hidden' : ''}" in:fade>
			<div class="flex flex-row gap-1.5 mt-3">
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				{#each palatte as c}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="p-3 rounded-full h-12 w-12 cursor-pointer flex justify-center items-center border-2 shadow-xl border-base-300
				{c.bg == newEmployer.palatte?.bg ? 'border-4 border-base-300 cursor-not-allowed' : ''}
				"
						style="background-color: {c.bg};"
						on:click={() => {
							newEmployer.palatte = c;
						}}
					>
						{#if c.bg == newEmployer.palatte?.bg}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5"
								style="color: {c.text}"
							>
								<path
									fill-rule="evenodd"
									d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
									clip-rule="evenodd"
								/>
							</svg>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		class="w-full border-4 border-base-300 cursor-pointer flex justify-center flex-col
        items-center max-h-[18rem] h-[18rem] rounded-xl border-dashed hover:border-primary transition delay-100"
		on:click={() => {
			input.click();
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="w-12 h-12 text-primary"
		>
			<path
				fill-rule="evenodd"
				d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z"
				clip-rule="evenodd"
			/>
		</svg>

		<div class="text-xl">Upload Employer Logo</div>
	</div>
{/if}

<div class="mt-5 space-y-5">
	<!-- Employer Name  -->
	<div class="">
		<label for="" class="mx-2">Employer Name</label>
		<input
			disabled={saving}
			type="text"
			bind:value={newEmployer.name}
			class="input input-primary w-full input-lg"
			placeholder="Employer Name"
		/>
	</div>

	<!-- Employer Website  -->
	<div class="">
		<label for="" class="mx-2">Employer Website</label>
		<div class="flex flex-row gap-2">
			<input
				disabled={saving}
				type="text"
				bind:value={newEmployer.website}
				class="input input-primary w-full input-lg basis-11/12"
				placeholder="Employer Website"
			/>
			<div class="tooltip" data-tip="Paste">
				<button class="btn btn-primary btn-lg btn-outline btn-circle">
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
							d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- About Employer  -->
	<div>
		<label for="" class="mx-2">About Employer</label>
		<textarea
			disabled={saving}
			bind:value={newEmployer.about}
			class="textarea textarea-primary w-full"
			placeholder="About Employer"
			rows="5"
		/>
	</div>
</div>

<div class="flex flex-row justify-between mt-8">
	<button
		disabled={saving}
		class="btn btn-secondary normal-case"
		on:click={() => {
			dispatch('close', {});
		}}>Cancel</button
	>

	<button
		disabled={saving}
		class="btn btn-primary normal-case"
		on:click={() => {
			//Validate
			if (newEmployer.name.length == 0) {
				toast.error("Please enter employer's name");
			} else if (imageFile == undefined) {
				toast.error("Please upload the employer's logo");
			} else {
				saveEmployer();
			}
		}}
	>
		{#if saving}
			<svg
				class="animate-spin h-5 w-5"
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
			Saving
		{:else}
			Save Employer
		{/if}
	</button>
</div>
