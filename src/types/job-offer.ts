export interface JobOffer {
  id: string
  fixerId: string
  fixerName: string
  fixerPhoto?: string
  title: string
  description: string
  price: number
  city: string
  photos: string[]
  services: string[]
  tags: string[]
  whatsapp: string
  createdAt: Date
  location?: {
    lat: number
    lng: number
    address?: string
  }
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  // Add other fields as needed
}

export interface IUserProfile {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'fixer' | 'requester';
    urlPhoto?: string;
  };
  profile: {
    ci: string;
    photoUrl?: string;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    } | null;
    services: Array<{
      id: string;
      name: string;
      custom?: boolean;
    }>;
    selectedServiceIds: string[];
    paymentMethods: Array<{
      type: string;
      accountInfo?: string;
    }>;
    experiences: Array<{
      id: string;
      title: string;
      description: string;
      years: number;
      images?: Array<{
        id: string;
        url: string;
        name: string;
        size: number;
        type: string;
      }>;
    }>;
    vehicle?: {
      hasVehicle?: boolean;
      type?: string;
      details?: string;
    };
    terms: {
      accepted: boolean;
      acceptedAt?: Date;
    };
    additionalInfo?: {
      bio?: string;
      languages?: string[];
      availability?: {
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
      };
      hourlyRate?: number;
    };
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface IJob {
  _id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  requesterId: string;
  fixerId?: string;
  price: number;
  fixerName?: string;
  department: string;
  jobType: string;
  createdAt?: string;
  updatedAt?: string;
}