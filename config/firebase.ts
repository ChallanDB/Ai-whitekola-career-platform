import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq7vEg7cInP8D4tIEJrj3HuhTwZrzN7vw",
  authDomain: "whitekola-47d90.firebaseapp.com",
  projectId: "whitekola-47d90",
  storageBucket: "whitekola-47d90.appspot.com",
  messagingSenderId: "1067071420460",
  appId: "1:1067071420460:web:c4f48436f0be1f07be7989"
};

// Initialize Firebase - do this only once
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export default app;