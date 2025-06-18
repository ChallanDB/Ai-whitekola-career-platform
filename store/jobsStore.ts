import { create } from 'zustand';
import { Job } from '@/types';
import { fetchLinkedInJobs } from '@/utils/mockData';
import { collection, getDocs, query, orderBy, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/utils/firebase';

interface JobsState {
  jobs: Job[];
  filteredJobs: Job[];
  isLoading: boolean;
  error: string | null;
  filters: {
    location: string;
    jobType: string;
    sector: string;
    search: string;
  };
  setJobs: (jobs: Job[]) => void;
  setFilteredJobs: (jobs: Job[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  updateFilters: (filters: Partial<JobsState['filters']>) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  fetchJobs: () => Promise<void>;
  postJob: (job: Omit<Job, 'id' | 'postedAt' | 'isPriority'>) => Promise<string>;
}

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  filteredJobs: [],
  isLoading: false,
  error: null,
  filters: {
    location: '',
    jobType: '',
    sector: '',
    search: '',
  },
  setJobs: (jobs) => set({ jobs, filteredJobs: jobs }),
  setFilteredJobs: (filteredJobs) => set({ filteredJobs }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  updateFilters: (filters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...filters } 
    })),
  applyFilters: async () => {
    const { filters } = get();
    set({ isLoading: true });
    
    try {
      // In a real app, this would call the LinkedIn API with filters
      const filtered = await fetchLinkedInJobs(filters);
      set({ filteredJobs: filtered, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to filter jobs',
        isLoading: false
      });
    }
  },
  clearFilters: () => set({ 
    filters: {
      location: '',
      jobType: '',
      sector: '',
      search: '',
    }
  }),
  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Use mock data instead of Firestore
      const linkedInJobs = await fetchLinkedInJobs();
      
      // Sort by priority first, then by date
      linkedInJobs.sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return b.postedAt - a.postedAt;
      });
      
      set({ 
        jobs: linkedInJobs as Job[], 
        filteredJobs: linkedInJobs as Job[], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
        isLoading: false
      });
    }
  },
  postJob: async (job) => {
    set({ isLoading: true, error: null });
    
    try {
      // Add priority flag and posted timestamp
      const newJob = {
        ...job,
        postedAt: Date.now(),
        isPriority: true
      };
      
      // Generate a unique ID
      const jobId = Date.now().toString();
      
      // Update local state
      const { jobs } = get();
      const updatedJobs = [{ ...newJob, id: jobId }, ...jobs] as Job[];
      
      // Sort by priority first, then by date
      updatedJobs.sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return b.postedAt - a.postedAt;
      });
      
      set({ 
        jobs: updatedJobs, 
        filteredJobs: updatedJobs,
        isLoading: false 
      });
      
      return jobId;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to post job',
        isLoading: false
      });
      throw error;
    }
  }
}));