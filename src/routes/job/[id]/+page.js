// @ts-nocheck
import { db } from '$lib/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

async function getJob(id) {
	const docRef = doc(db, 'jobs', id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return null;
	}
}

export let load = async ({ params }) => {
	let id = params.id;
	let job = await getJob(id);
	return {
		job
	};
};
