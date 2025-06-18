// Firebase configuration and mock implementations
//import { initializeApp } from 'firebase/app';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq7vEg7cInP8D4tIEJrj3HuhTwZrzN7vw",
  authDomain: "whitekola-47d90.firebaseapp.com",
  projectId: "whitekola-47d90",
  storageBucket: "whitekola-47d90.firebasestorage.app",
  messagingSenderId: "1067071420460",
  appId: "1:1067071420460:web:c4f48436f0be1f07be7989"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Setup localStorage for web or AsyncStorage for mobile
const getLocalStorage = () => {
  if (Platform.OS === 'web') {
    return window.localStorage;
  } else {
    return {
      getItem: async (key: string) => {
        try {
          return await AsyncStorage.getItem(key);
        } catch (e) {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (e) {
          console.error('Error storing value', e);
        }
      },
      removeItem: async (key: string) => {
        try {
          await AsyncStorage.removeItem(key);
        } catch (e) {
          console.error('Error removing value', e);
        }
      }
    };
  }
};

// Mock auth functions using local storage
const signIn = async (email: string, password: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in local storage
    const storage = getLocalStorage();
    const usersString = await storage.getItem('users');
    const users = usersString ? JSON.parse(usersString) : [];
    
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    return {
      uid: user.id,
      email: user.email,
      displayName: user.username
    };
  } catch (error) {
    throw error;
  }
};

const signUp = async (email: string, password: string, username: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const storage = getLocalStorage();
    const usersString = await storage.getItem('users');
    const users = usersString ? JSON.parse(usersString) : [];
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      username,
      hasCV: false,
      createdAt: Date.now()
    };
    
    // Save to local storage
    await storage.setItem('users', JSON.stringify([...users, newUser]));
    
    return {
      uid: newUser.id,
      email: newUser.email,
      displayName: newUser.username
    };
  } catch (error) {
    throw error;
  }
};

const resetPassword = async (email: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists
    const storage = getLocalStorage();
    const usersString = await storage.getItem('users');
    const users = usersString ? JSON.parse(usersString) : [];
    
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, this would send an email
    console.log(`Password reset email sent to ${email}`);
    
    return true;
  } catch (error) {
    throw error;
  }
};

const logOut = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    throw error;
  }
};

// Mock Firestore functions
const createDocument = async (collectionName: string, data: any, id: string | null = null) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storage = getLocalStorage();
    const collectionString = await storage.getItem(collectionName);
    const collection = collectionString ? JSON.parse(collectionString) : [];
    
    const docId = id || Date.now().toString();
    const newDoc = {
      id: docId,
      ...data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    await storage.setItem(collectionName, JSON.stringify([...collection, newDoc]));
    
    return docId;
  } catch (error) {
    throw error;
  }
};

const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storage = getLocalStorage();
    const collectionString = await storage.getItem(collectionName);
    const collection = collectionString ? JSON.parse(collectionString) : [];
    
    const updatedCollection = collection.map((doc: any) => {
      if (doc.id === id) {
        return {
          ...doc,
          ...data,
          updatedAt: Date.now()
        };
      }
      return doc;
    });
    
    await storage.setItem(collectionName, JSON.stringify(updatedCollection));
    
    return true;
  } catch (error) {
    throw error;
  }
};

const deleteDocument = async (collectionName: string, id: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storage = getLocalStorage();
    const collectionString = await storage.getItem(collectionName);
    const collection = collectionString ? JSON.parse(collectionString) : [];
    
    const updatedCollection = collection.filter((doc: any) => doc.id !== id);
    
    await storage.setItem(collectionName, JSON.stringify(updatedCollection));
    
    return true;
  } catch (error) {
    throw error;
  }
};

const getDocument = async (collectionName: string, id: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storage = getLocalStorage();
    const collectionString = await storage.getItem(collectionName);
    const collection = collectionString ? JSON.parse(collectionString) : [];
    
    const doc = collection.find((d: any) => d.id === id);
    
    return doc || null;
  } catch (error) {
    throw error;
  }
};

interface QueryCondition {
  field: string;
  operator: string;
  value: any;
}

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

const getDocuments = async (
  collectionName: string, 
  conditions: QueryCondition[] = [], 
  sortBy: SortOption | null = null
) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const storage = getLocalStorage();
    const collectionString = await storage.getItem(collectionName);
    let documents = collectionString ? JSON.parse(collectionString) : [];
    
    // Apply conditions
    if (conditions.length > 0) {
      documents = documents.filter((doc: any) => {
        return conditions.every(condition => {
          const { field, operator, value } = condition;
          
          switch (operator) {
            case '==':
              return doc[field] === value;
            case '!=':
              return doc[field] !== value;
            case '>':
              return doc[field] > value;
            case '>=':
              return doc[field] >= value;
            case '<':
              return doc[field] < value;
            case '<=':
              return doc[field] <= value;
            default:
              return true;
          }
        });
      });
    }
    
    // Apply sorting
    if (sortBy) {
      documents.sort((a: any, b: any) => {
        if (sortBy.direction === 'asc') {
          return a[sortBy.field] > b[sortBy.field] ? 1 : -1;
        } else {
          return a[sortBy.field] < b[sortBy.field] ? 1 : -1;
        }
      });
    }
    
    return documents;
  } catch (error) {
    throw error;
  }
};

// Mock Storage functions
const uploadFile = async (path: string, file: any) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would upload to Firebase Storage
    // For now, just return a mock URL
    return `https://firebasestorage.example.com/${path}`;
  } catch (error) {
    throw error;
  }
};

const deleteFile = async (path: string) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would delete from Firebase Storage
    return true;
  } catch (error) {
    throw error;
  }
};

export {
  auth,
  firestore,
  storage,
  signIn,
  signUp,
  resetPassword,
  logOut,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  uploadFile,
  deleteFile
};