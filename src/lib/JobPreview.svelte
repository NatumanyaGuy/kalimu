<script>
	// @ts-nocheck
	import { formatDistance } from 'date-fns';
	import { fade } from 'svelte/transition';
	export let job;
	// console.log(job);
</script>

<div
	class="card card-compact rounded-xl w-full shadow cursor-default border-base-300 border-2"
	in:fade
	style="background-color: {job?.bg_color}; color:{job?.text_color}"
>
	<div class="card-body">
		<div class="flex flex-row gap-1">
			<div class="basis-2/3 space-y-2">
				{#if job?.position.length == 0}
					<div class="h-8 bg-base-300 rounded-md" />
				{:else}
					<p class="text-lg font-bold" in:fade>
						{job?.position}
					</p>
				{/if}

				<!-- <div class="divider my-0 py-0" /> -->

				{#if job?.employer.length == 0}
					<div class="h-6 bg-base-300 rounded-md" />
				{:else}
					<p class="text-sm font-bold" in:fade>
						{job?.employer}
					</p>
				{/if}

				{#if job?.locations.length == 0}
					<div class="h-4 bg-base-300 w-1/2 rounded-md" />
				{:else}
					<p class="text-xs font-semibold opacity-90" in:fade>
						{job?.locations}
					</p>
				{/if}
			</div>
			<div class="basis-1/3 bg-base-100 rounded-xl p-2 flex items-center justify-center">
				{#if job?.employer_logoURL.length == 0}
					<div class="h-16 w-full bg-base-300 rounded-md animate-pulse" />
				{:else}
					<img src={job?.employer_logoURL} class="h-20 object-contain w-full" alt="" in:fade />
				{/if}
			</div>
		</div>
		<div class="card-actions justify-between mt-2 pb-1">
			<div class="bg-base-300 w-12 h-4 rounded-md animate-pulse" />
			<div class="flex flex-row gap-2">
				<!-- Share  -->
				<button class="btn btn-ghost btn-sm btn-circle normal-case">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z"
						/>
					</svg>
				</button>
				<!-- Delete  -->
				<button class="btn btn-ghost btn-sm btn-circle normal-case">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-4 h-4"
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
		class="text-end pb-2 px-6 rounded-b-lg grayscale-[0.5] shadow-sm"
		style="background-color: {job?.bg_color}; color:{job?.text_color}"
	>
		<p class="text-xs">
			Deadline {formatDistance(new Date(job?.deadline || new Date()), new Date(), {
				addSuffix: true
			})}
		</p>
	</div>
</div>
