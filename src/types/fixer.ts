export interface Fixer {
  id: string;
  name: string;
  city: string;
  rating: number;
  avatar?: string;
  description?: string;
  phone?: string;
  email?: string;
}

export interface Job {
  id: string;
  jobType: string;
  description?: string;
}

export interface JobWithFixers {
  jobType: string;
  fixers: Fixer[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
