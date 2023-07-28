<script lang="ts">
	//@ts-nocheck
	import { onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import StarterKit from '@tiptap/starter-kit';
	import cx from 'classnames';
	import Link from '@tiptap/extension-link';
	import { Editor, EditorContent, BubbleMenu, createEditor } from 'svelte-tiptap';
	import { Toaster, toast } from 'svelte-sonner';
	import { createEventDispatcher } from 'svelte';
	import Drawer from 'svelte-drawer-component';
	let open = false;
	const dispatch = createEventDispatcher();

	let editor: Readable<Editor>;
	let newLink = '';

	onMount(() => {
		editor = createEditor({
			extensions: [StarterKit, Link],
			content: `<h1>Enter Job Details.....</h1>`,
			editorProps: {
				attributes: {
					class:
						'border-t-2 border-base-300  px-10 py-3 outline-none h-[78vh] overflow-y-auto shadow'
				}
			}
		});
	});

	const toggleBold = () => {
		$editor.chain().focus().toggleBold().run();
	};

	const toggleItalic = () => {
		$editor.chain().focus().toggleItalic().run();
	};
	const toggleStrike = () => {
		$editor.chain().focus().toggleStrike().run();
	};
	function addLink(url) {
		$editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
	}

	$: isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);

	let html = '';
</script>

<div class="bg-base-100 rounded-xl min-h-[80vh]">
	<div class="flex justify-end gap-4 p-3">
		<button
			class="btn btn-secondary normal-case text-lg"
			on:click={async () => {
				html = $editor.getHTML();
				open = true;
			}}
		>
			Review
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
				<path
					fill-rule="evenodd"
					d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		<button
			class="btn btn-primary normal-case text-lg"
			on:click={() => {
				html = $editor.getHTML();
				dispatch('publish', {
					details: html
				});
			}}
		>
			Publish Job
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z"
				/>
			</svg>
		</button>
	</div>

	{#if editor}
		<BubbleMenu editor={$editor}>
			<div
				data-test-id="bubble-menu"
				class="join bg-primary text-primary-content fill-primary-content"
			>
				<!-- Bold  -->
				<button
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('bold')
					})} join-item"
					type="button"
					on:click={toggleBold}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						height="48"
						viewBox="0 -960 960 960"
						width="48"
						><path
							d="M275-200v-560h228q66 0 114.5 42T666-612q0 38-21 70t-56 49v6q43 14 69.5 50t26.5 81q0 68-52.5 112T510-200H275Zm86-76h144q38 0 66-25t28-63q0-37-28-62t-66-25H361v175Zm0-247h136q35 0 60.5-23t25.5-58q0-35-25.5-58.5T497-686H361v163Z"
						/></svg
					>
				</button>
				<!-- Italic -->
				<button
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('italic')
					})} join-item"
					type="button"
					on:click={toggleItalic}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						viewBox="0 -960 960 960"
						class="h-4 w-4"
						width="48"
						><path d="M224-199v-80h134l139-409H338v-80h380v80H584L445-279h159v80H224Z" /></svg
					>
				</button>
				<!-- Strike -->
				<button
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('strike')
					})} join-item"
					type="button"
					on:click={toggleStrike}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						class="w-4 h-4"
						viewBox="0 -960 960 960"
						width="48"
						><path
							d="M80-410v-60h800v60H80Zm350-120v-170H200v-100h560v100H530v170H430Zm0 370v-190h100v190H430Z"
						/></svg
					>
				</button>
				<!-- Headings -->
				{#each [1, 2] as level}
					<button
						class="{cx('btn btn-sm btn-ghost normal-case', {
							'btn btn-primary btn-sm': isActive(('heading', { level: level }))
						})} join-item"
						type="button"
						on:click={$editor.chain().focus().toggleHeading({ level: level }).run()}
					>
						H{level}
					</button>
				{/each}
				<!-- Paragraph -->
				<button
					on:click={() => $editor.chain().focus().setParagraph().run()}
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('paragraph')
					})} join-item"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						class="h-4 w-4"
						viewBox="0 -960 960 960"
						width="48"
						><path
							d="M240-120v-720h288q98 0 165 67t67 165q0 98-67 165t-165 67H360v256H240Zm120-376h168q48 0 80-32t32-80q0-48-32-80t-80-32H360v224Z"
						/></svg
					>
				</button>
				<!-- List Unordered -->
				<button
					on:click={() => $editor.chain().focus().toggleBulletList().run()}
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('bulletList')
					})} join-item"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						height="48"
						viewBox="0 -960 960 960"
						width="48"
						><path
							d="M377-198v-60h463v60H377Zm0-252v-60h463v60H377Zm0-253v-60h463v60H377ZM189-161q-28.05 0-48.025-19Q121-199 121-227.5t19.5-48q19.5-19.5 48-19.5t47.5 19.975Q255-255.05 255-227q0 27.225-19.387 46.613Q216.225-161 189-161Zm0-252q-28.05 0-48.025-19.681Q121-452.362 121-480t19.975-47.319Q160.95-547 189-547q27.225 0 46.613 19.681Q255-507.638 255-480t-19.387 47.319Q216.225-413 189-413Zm-1-253q-27.637 0-47.319-19.681Q121-705.362 121-733t19.681-47.319Q160.363-800 188-800q27.637 0 47.319 19.681Q255-760.638 255-733t-19.681 47.319Q215.637-666 188-666Z"
						/></svg
					>
				</button>
				<!-- List Ordered -->
				<button
					on:click={() => $editor.chain().focus().toggleOrderedList().run()}
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('orderedList')
					})} join-item"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						height="48"
						viewBox="0 -960 960 960"
						width="48"
						><path
							d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm189 431v-60h471v60H369Zm0-243v-60h471v60H369Zm0-243v-60h471v60H369Z"
						/></svg
					>
				</button>
				<!-- Horizontal Rule -->
				<button
					on:click={() => $editor.chain().focus().setHorizontalRule().run()}
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('orderedList')
					})} join-item"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						height="48"
						viewBox="0 -960 960 960"
						width="48"><path d="M160-450v-60h640v60H160Z" /></svg
					>
				</button>
				<!-- Link -->
				<button
					onclick="add_link.showModal()"
					class="{cx('btn btn-sm btn-ghost normal-case', {
						'btn btn-primary btn-sm': isActive('link')
					})} join-item"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="48"
						class="w-4 h-4"
						viewBox="0 -960 960 960"
						width="48"
						><path
							d="M450-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h170v60H280q-58.333 0-99.167 40.765-40.833 40.764-40.833 99Q140-422 180.833-381q40.834 41 99.167 41h170v60ZM325-450v-60h310v60H325Zm185 170v-60h170q58.333 0 99.167-40.765 40.833-40.764 40.833-99Q820-538 779.167-579 738.333-620 680-620H510v-60h170q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H510Z"
						/></svg
					>
				</button>
			</div>
		</BubbleMenu>
	{/if}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div id="tip_tap" on:contextmenu|preventDefault={() => {}}>
		<EditorContent editor={$editor} />
	</div>
</div>

<!-- <button
	class="btn btn-primary"
	on:click={() => {
		html = $editor.getHTML();
		// console.log(html);
	}}>Console Log</button
> -->

<!-- Add Modal  -->
<!-- Open the modal using ID.showModal() method -->
<button class="btn hidden" onclick="add_link.showModal()">open modal</button>
<dialog id="add_link" class="modal">
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg text-center">Add Link</h3>
		<div class="py-2 flex gap-3">
			<input
				bind:value={newLink}
				type="text"
				class="input input-primary w-full basis-11/12"
				placeholder="https://www.google.com"
			/>
			<button
				class="btn btn-circle btn-ghost"
				on:click|preventDefault={() => {
					navigator.clipboard
						.readText()
						.then((text) => {
							newLink = text;
						})
						.catch((err) => {
							console.error('Failed to read clipboard contents: ', err);
							toast.error('Failed to read clipboard contents');
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
						fill-rule="evenodd"
						d="M15.988 3.012A2.25 2.25 0 0118 5.25v6.5A2.25 2.25 0 0115.75 14H13.5v-3.379a3 3 0 00-.879-2.121l-3.12-3.121a3 3 0 00-1.402-.791 2.252 2.252 0 011.913-1.576A2.25 2.25 0 0112.25 1h1.5a2.25 2.25 0 012.238 2.012zM11.5 3.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v.25h-3v-.25z"
						clip-rule="evenodd"
					/>
					<path
						d="M3.5 6A1.5 1.5 0 002 7.5v9A1.5 1.5 0 003.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L8.44 6.439A1.5 1.5 0 007.378 6H3.5z"
					/>
				</svg>
			</button>
		</div>
		<div class="modal-action w-full justify-between">
			<!-- if there is a button in form, it will close the modal -->
			<button class="btn btn-ghost text-primary normal-case">Cancel</button>
			<button
				class="btn btn-ghost text-secondary normal-case"
				on:click={() => {
					addLink(newLink);
				}}>Add Link</button
			>
		</div>
	</form>
</dialog>

<Drawer
	{open}
	size="40vw"
	placement="right"
	on:clickAway={() => {
		open = false;
	}}
>
	<div class="bg-base-200 py-6 h-screen w-full items-center justify-center">
		<!-- Mockup  -->

		<div
			class="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[90vh] w-[370px]"
		>
			<div
				class="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"
			/>
			<div
				class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"
			/>
			<div
				class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"
			/>
			<div
				class="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"
			/>
			<div class="rounded-[2rem] overflow-hidden w-[342px] h-[85vh] bg-base-100">
				<div class=" w-[342px] h-[85vh] px-3 py-4 overflow-y-auto" id="tip_tap">
					<div class="mt-2">
						<slot />
						<div class="p-2">
							{@html html}
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- Mockup end  -->
	</div>
</Drawer>
