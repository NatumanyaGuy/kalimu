// @ts-nocheck
import { db } from '$lib/firebaseConfig';
import { error } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

async function getJob(id) {
	const docRef = doc(db, 'jobs', id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return { ...docSnap.data(), id: id };
	} else {
		throw error(404, {
			message: 'Not found'
		});
	}
}

export let load = async ({ params }) => {
	let id = params.id;
	let job = await getJob(id);
	return {
		job: JSON.parse(JSON.stringify(job))
	};
};
