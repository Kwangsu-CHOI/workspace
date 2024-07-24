import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCU-H5-UyGdIiSF8vGE5T7Tf9vADQIcjCY",
	authDomain: "notion-clone-92001.firebaseapp.com",
	projectId: "notion-clone-92001",
	storageBucket: "notion-clone-92001.appspot.com",
	messagingSenderId: "369540728586",
	appId: "1:369540728586:web:138660a8c544edfc1b9cf3",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };
