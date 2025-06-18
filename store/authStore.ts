import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Mock user database
const mockUsers: Record<string, { email: string; password: string; username: string }> = {
  'user@example.com': { email: 'user@example.com', password: 'password123', username: 'User' },
  'admin@example.com': { email: 'admin@example.com', password: 'admin123', username: 'Admin' },
};

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
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user exists and password matches
          const user = mockUsers[email];
          if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
          }
          
          // Set user data
          set({
            user: {
              id: email,
              email,
              username: user.username,
              hasCV: false
            },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false
          });
          throw error;
        }
      },
      register: async (email, password, username) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if user already exists
          if (mockUsers[email]) {
            throw new Error('User already exists');
          }
          
          // Add user to mock database
          mockUsers[email] = { email, password, username };
          
          // Set user data
          set({
            user: {
              id: email,
              email,
              username,
              hasCV: false
            },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false
          });
          throw error;
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);