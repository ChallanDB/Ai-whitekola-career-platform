// Polyfill for localStorage in React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a localStorage-like API using AsyncStorage
const localStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  },
  
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  },
  
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },
  
  // Synchronous versions for compatibility
  getItemSync: (key: string): string | null => {
    let result = null;
    // This is a hack to make it work synchronously
    AsyncStorage.getItem(key)
      .then(value => {
        result = value;
      })
      .catch(error => {
        console.error('Error getting item from AsyncStorage:', error);
      });
    return result;
  },
  
  setItemSync: (key: string, value: string): void => {
    AsyncStorage.setItem(key, value)
      .catch(error => {
        console.error('Error setting item in AsyncStorage:', error);
      });
  },
  
  removeItemSync: (key: string): void => {
    AsyncStorage.removeItem(key)
      .catch(error => {
        console.error('Error removing item from AsyncStorage:', error);
      });
  },
  
  clearSync: (): void => {
    AsyncStorage.clear()
      .catch(error => {
        console.error('Error clearing AsyncStorage:', error);
      });
  }
};

// Make it globally available
(global as any).localStorage = localStorage;

export default localStorage;