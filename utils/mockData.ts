import { Job } from '@/types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'TechCorp Cameroon',
    description: 'We are looking for an experienced React Native developer to join our mobile team in Douala. You will be responsible for building and maintaining cross-platform mobile applications for our clients across Africa.',
    location: 'Douala, Cameroon',
    jobType: 'Remote',
    sector: 'Technology',
    salary: 'XAF 1,500,000 - 2,000,000',
    deadline: '2025-07-15',
    postedBy: 'user123',
    postedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    applicationType: 'internal',
    isExternal: false,
    isPriority: true,
    applicationLink: '',
    source: 'WhiteKola'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'DesignHub Cameroon',
    description: 'Join our creative team as a UX/UI Designer in Yaoundé. You will create beautiful, intuitive interfaces for web and mobile applications for local and international clients.',
    location: 'Yaoundé, Cameroon',
    jobType: 'Hybrid',
    sector: 'Design',
    salary: 'XAF 1,200,000 - 1,800,000',
    deadline: '2025-07-20',
    postedBy: 'user456',
    postedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    applicationType: 'internal',
    isExternal: false,
    isPriority: true,
    applicationLink: '',
    source: 'WhiteKola'
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'DataWorks Africa',
    description: 'We are seeking a Data Scientist to analyze large datasets and build machine learning models to solve business problems for our clients in the banking and telecom sectors in Cameroon.',
    location: 'Buea, Cameroon',
    jobType: 'Onsite',
    sector: 'Data Science',
    salary: 'XAF 1,800,000 - 2,500,000',
    deadline: '2025-07-25',
    postedBy: 'user789',
    postedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    applicationType: 'external',
    applicationLink: 'https://dataworks.com/careers',
    isExternal: true,
    source: 'LinkedIn',
    isPriority: false,
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'ProductLabs Cameroon',
    description: 'Lead product development from conception to launch. Work with cross-functional teams to deliver exceptional products for the Cameroonian market.',
    location: 'Douala, Cameroon',
    jobType: 'Hybrid',
    sector: 'Product Management',
    salary: 'XAF 1,500,000 - 2,200,000',
    deadline: '2025-07-30',
    postedBy: 'user101',
    postedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    applicationType: 'internal',
    isExternal: false,
    isPriority: true,
    applicationLink: '',
    source: 'WhiteKola'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudSystems Africa',
    description: 'Join our DevOps team to build and maintain our cloud infrastructure. Experience with AWS, Docker, and Kubernetes required. Work with clients across Cameroon and West Africa.',
    location: 'Limbe, Cameroon',
    jobType: 'Remote',
    sector: 'Technology',
    salary: 'XAF 1,700,000 - 2,300,000',
    deadline: '2025-08-05',
    postedBy: 'user202',
    postedAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
    applicationType: 'external',
    applicationLink: 'https://cloudsystems.io/jobs',
    isExternal: true,
    source: 'LinkedIn',
    isPriority: false,
  },
  {
    id: '6',
    title: 'Marketing Manager',
    company: 'AfriTech Solutions',
    description: 'Lead our marketing efforts across Cameroon and neighboring countries. Develop and implement marketing strategies to increase brand awareness and drive customer acquisition.',
    location: 'Yaoundé, Cameroon',
    jobType: 'Onsite',
    sector: 'Marketing',
    salary: 'XAF 1,400,000 - 2,000,000',
    deadline: '2025-08-10',
    postedBy: 'user303',
    postedAt: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
    applicationType: 'internal',
    isExternal: false,
    isPriority: true,
    applicationLink: '',
    source: 'WhiteKola'
  },
  {
    id: '7',
    title: 'English Teacher',
    company: 'International School of Cameroon',
    description: 'Teach English to secondary school students. Develop curriculum and assessment materials. Collaborate with other teachers to create an engaging learning environment.',
    location: 'Bamenda, Cameroon',
    jobType: 'Onsite',
    sector: 'Education',
    salary: 'XAF 900,000 - 1,200,000',
    deadline: '2025-08-15',
    postedBy: 'user404',
    postedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    applicationType: 'external',
    applicationLink: 'https://isc.edu.cm/careers',
    isExternal: true,
    source: 'LinkedIn',
    isPriority: false,
  },
];

export const jobSectors = [
  'Technology',
  'Design',
  'Data Science',
  'Product Management',
  'Marketing',
  'Sales',
  'Customer Service',
  'Finance',
  'Human Resources',
  'Healthcare',
  'Education',
  'Engineering',
  'Legal',
  'Consulting',
  'Retail',
  'Agriculture',
  'Telecommunications',
  'Oil & Gas',
  'Hospitality',
  'Construction',
];

export const jobTypes = ['Remote', 'Hybrid', 'Onsite'];

export const cameroonLocations = [
  'Douala',
  'Yaoundé',
  'Bamenda',
  'Bafoussam',
  'Garoua',
  'Maroua',
  'Limbe',
  'Buea',
  'Kribi',
  'Kumba',
  'Bertoua',
  'Ngaoundéré',
  'Edéa',
  'Ebolowa',
  'Dschang',
  'Nkongsamba',
  'Remote'
];

export const mockChatMessages = [
  {
    id: '1',
    role: 'assistant' as const,
    content: 'Hello! I am your AI career assistant. How can I help you today with your career in Cameroon?',
    timestamp: Date.now() - 60000,
  },
];

export const mockCounselingSlots = [
  {
    date: '2025-06-15',
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: false },
      { time: '13:00', available: true },
      { time: '14:00', available: true },
      { time: '15:00', available: false },
      { time: '16:00', available: true },
    ],
  },
  {
    date: '2025-06-16',
    slots: [
      { time: '09:00', available: false },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '13:00', available: true },
      { time: '14:00', available: false },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
    ],
  },
  {
    date: '2025-06-17',
    slots: [
      { time: '09:00', available: true },
      { time: '10:00', available: true },
      { time: '11:00', available: true },
      { time: '13:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: false },
    ],
  },
];

// Function to simulate fetching jobs from LinkedIn API
export const fetchLinkedInJobs = async (filters: {
  location?: string;
  jobType?: string;
  sector?: string;
  search?: string;
} = {}) => {
  // In a real app, this would be an API call to LinkedIn
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter the mock jobs based on the provided filters
  let filteredJobs = [...mockJobs];
  
  if (filters.location && filters.location !== '') {
    filteredJobs = filteredJobs.filter(
      job => job.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  if (filters.jobType && filters.jobType !== '') {
    filteredJobs = filteredJobs.filter(
      job => job.jobType.toLowerCase() === filters.jobType!.toLowerCase()
    );
  }
  
  if (filters.sector && filters.sector !== '') {
    filteredJobs = filteredJobs.filter(
      job => job.sector.toLowerCase().includes(filters.sector!.toLowerCase())
    );
  }
  
  if (filters.search && filters.search !== '') {
    const searchLower = filters.search.toLowerCase();
    filteredJobs = filteredJobs.filter(
      job => 
        job.title.toLowerCase().includes(searchLower) || 
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by priority first, then by date
  filteredJobs.sort((a, b) => {
    if (a.isPriority && !b.isPriority) return -1;
    if (!a.isPriority && b.isPriority) return 1;
    return b.postedAt - a.postedAt;
  });
  
  return filteredJobs;
};