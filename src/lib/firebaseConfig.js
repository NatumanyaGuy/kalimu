// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyBvGjH-agOCAb_QzL1FolyQSc785rRQJrQ',
	authDomain: 'muriro-kalimu-project.firebaseapp.com',
	projectId: 'muriro-kalimu-project',
	storageBucket: 'muriro-kalimu-project.appspot.com',
	messagingSenderId: '1088528916283',
	appId: '1:1088528916283:web:a0e4f7d49749eba975211e'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
