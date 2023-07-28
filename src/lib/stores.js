import { writable } from 'svelte/store';

export let _jobs = writable([]);
export let _jobs_searched = writable([]);
export let _lastVisible = writable(null);
export let _lastVisible_search = writable(null);
