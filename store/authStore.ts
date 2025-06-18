import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '@/utils/firebase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  initAuth: () => () => void; // Fixed return type to match unsubscribe function
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setIsLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
      initAuth: () => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          set({ isLoading: true });
          
          if (firebaseUser) {
            try {
              // Get additional user data from Firestore
              const userData = await getUserData(firebaseUser.uid);
              
              if (userData) {
                set({ 
                  user: userData,
                  isAuthenticated: true,
                  isLoading: false
                });
              } else {
                // If no user data in Firestore, create basic user object
                set({
                  user: {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    photoURL: firebaseUser.photoURL || undefined,
                    hasCV: false
                  },
                  isAuthenticated: true,
                  isLoading: false
                });
              }
            } catch (error) {
              console.error('Error getting user data:', error);
              set({ 
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to get user data'
              });
            }
          } else {
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        });

        // Return unsubscribe function
        return unsubscribe;
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Initialize auth listener when the store is first used
let unsubscribe: (() => void) | undefined;

// This ensures the auth listener is initialized only once
if (typeof window !== 'undefined') {
  const initializeAuth = () => {
    const store = useAuthStore.getState();
    if (!unsubscribe) {
      unsubscribe = store.initAuth();
    }
  };
  
  initializeAuth();
}