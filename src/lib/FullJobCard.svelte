<script>
	// @ts-nocheck
	import { formatDistance } from 'date-fns';
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	const dispatch = createEventDispatcher();
	export let job;
	// console.log(job);
</script>

<div
	class="card rounded-xl w-full shadow hover:shadow-lg transition-shadow cursor-default"
	in:fade
	style="background-color: {job?.bg_color}; color:{job?.text_color}"
>
	<div class="card-body pb-2 pt-4">
		<div class="flex flex-row gap-3">
			<div class="basis-2/3 space-y-1">
				<p class="text-lg capitalize font-bold" in:fade>
					{job?.position}
				</p>

				<!-- <div class="divider my-0 py-0" /> -->

				<p class="text-sm font-semibold line-clamp-2" in:fade>
					{job?.employer}
				</p>
				<p class="text-sm font-light opacity-90" in:fade>
					{job?.locations}
				</p>
			</div>
			<div
				class="basis-1/3 p-2 flex items-center justify-center"
				style="background-color: {job?.bg_color}; color:{job?.text_color}"
			>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<img
					on:click={() => {
						dispatch('preview', {});
					}}
					src={job?.employer_logoURL}
					class="h-fit
					object-contain
					 w-full"
					alt=""
					in:fade
				/>
			</div>
		</div>
		<div class="card-actions justify-between mt-2 pb-0">
			<a href="/job/{job?.id}" class="btn btn-sm btn-ghost normal-case">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-4 h-4"
				>
					<path
						d="M4.25 2A2.25 2.25 0 002 4.25v2a.75.75 0 001.5 0v-2a.75.75 0 01.75-.75h2a.75.75 0 000-1.5h-2zM13.75 2a.75.75 0 000 1.5h2a.75.75 0 01.75.75v2a.75.75 0 001.5 0v-2A2.25 2.25 0 0015.75 2h-2zM3.5 13.75a.75.75 0 00-1.5 0v2A2.25 2.25 0 004.25 18h2a.75.75 0 000-1.5h-2a.75.75 0 01-.75-.75v-2zM18 13.75a.75.75 0 00-1.5 0v2a.75.75 0 01-.75.75h-2a.75.75 0 000 1.5h2A2.25 2.25 0 0018 15.75v-2zM7 10a3 3 0 116 0 3 3 0 01-6 0z"
					/>
				</svg>
				View Job
			</a>

			<div class="flex flex-row gap-2">
				<!-- Share  -->
				<button
					class="btn btn-sm btn-ghost btn-circle normal-case"
					on:click={async () => {
						let shareData = {
							title: job?.position,
							text: job?.position + ' at ' + job?.employer,
							url: `https://kalimu.muriro.com/job/${job?.id}`,
							title: 'Share Job'
						};
						try {
							await navigator.share(shareData);
							toast('Copied');
						} catch (err) {
							// resultPara.textContent = `Error: ${err}`;
							toast.error("Couldn't copy");
						}
					}}
				>
					{#if job.sharing}
						<span in:fade>
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
						</span>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path
								d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z"
							/>
						</svg>
					{/if}
				</button>
				<!-- Delete  -->
				<button
					class="btn btn-sm btn-ghost btn-circle normal-case"
					disabled
					on:click={() => {
						dispatch('favorite', {
							id: job?.id
						});
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5"
					>
						<path
							d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
	<div
		class="text-end py-4 px-6 rounded-b-lg grayscale-[0.5] shadow-sm"
		style="background-color: {job?.bg_color}; color:{job?.text_color}"
	>
		<p class="text-xs">
			Deadline {formatDistance(new Date(job?.deadline || new Date()), new Date(), {
				addSuffix: true
			})}
		</p>
	</div>
</div>
