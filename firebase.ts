import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
	messagingSenderId: process.env
		.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };
