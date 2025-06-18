import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { User } from '@/types';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq7vEg7cInP8D4tIEJrj3HuhTwZrzN7vw",
  authDomain: "whitekola-47d90.firebaseapp.com",
  projectId: "whitekola-47d90",
  storageBucket: "whitekola-47d90.appspot.com",
  messagingSenderId: "1067071420460",
  appId: "1:1067071420460:web:c4f48436f0be1f07be7989"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

export const signUp = async (email: string, password: string, username: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with username
    await updateProfile(userCredential.user, {
      displayName: username
    });
    
    // Create user document in Firestore
    await setDoc(doc(firestore, 'users', userCredential.user.uid), {
      email,
      username,
      hasCV: false,
      createdAt: serverTimestamp()
    });
    
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    throw new Error(error.message || 'Failed to reset password');
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Firestore functions
export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: userId,
        email: userData.email,
        username: userData.username,
        photoURL: userData.photoURL,
        hasCV: userData.hasCV || false
      };
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting user data:', error);
    throw new Error(error.message || 'Failed to get user data');
  }
};

export const updateUserData = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(firestore, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error updating user data:', error);
    throw new Error(error.message || 'Failed to update user data');
  }
};

// Storage functions
export const uploadFile = async (path: string, file: Blob): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error(error.message || 'Failed to delete file');
  }
};

// Generic document functions
export const createDocument = async <T>(
  collectionName: string, 
  data: T, 
  id?: string
): Promise<string> => {
  try {
    const docRef = id 
      ? doc(firestore, collectionName, id) 
      : doc(collection(firestore, collectionName));
    
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error: any) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw new Error(error.message || `Failed to create document in ${collectionName}`);
  }
};

export const updateDocument = async <T>(
  collectionName: string, 
  id: string, 
  data: Partial<T>
): Promise<void> => {
  try {
    await updateDoc(doc(firestore, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw new Error(error.message || `Failed to update document in ${collectionName}`);
  }
};

export const getDocument = async <T>(
  collectionName: string, 
  id: string
): Promise<T | null> => {
  try {
    const docSnap = await getDoc(doc(firestore, collectionName, id));
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw new Error(error.message || `Failed to get document from ${collectionName}`);
  }
};

export const deleteDocument = async (
  collectionName: string, 
  id: string
): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, collectionName, id));
  } catch (error: any) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw new Error(error.message || `Failed to delete document from ${collectionName}`);
  }
};

export { auth, firestore, storage };