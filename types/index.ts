export interface User {
  id: string;
  email: string;
  username: string;
  photoURL?: string;
  hasCV: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  jobType: 'Remote' | 'Hybrid' | 'Onsite';
  sector: string;
  salary?: string;
  deadline: string;
  postedBy: string;
  postedAt: number;
  applicationType: 'internal' | 'external';
  applicationLink: string;
  isExternal: boolean;
  source?: string;
  isPriority?: boolean;
}

export interface CV {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  photoURL: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  references: Reference[];
  createdAt: number;
  updatedAt: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  description?: string;
}

export interface Reference {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface CounselingSession {
  id: string;
  userId: string;
  counselorId: string;
  date: string;
  startTime: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  paymentStatus: 'pending' | 'completed';
  paymentAmount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'application' | 'counselor' | 'system';
  relatedId?: string;
  timestamp: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedAt: number;
  cvId: string;
}