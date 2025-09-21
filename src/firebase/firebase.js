import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ97rbpM3RKrsWUQWbpWvjj0o5GLmzqCA",
  authDomain: "soundstore-6a6da.firebaseapp.com",
  projectId: "soundstore-6a6da",
  storageBucket: "soundstore-6a6da.firebasestorage.app",
  messagingSenderId: "907333003753",
  appId: "1:907333003753:web:9e9099ec66416111050378"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;