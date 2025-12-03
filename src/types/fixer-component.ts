export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface ComponentJobOffer {
  id: string;
  title: string;
  description: string;
  services: string[];
  price: number;
  createdAt: Date;
  city: string;
  rating: number;
  completedJobs: number;
  location: Location;
  fixerId: string;
  fixerName: string;
  tags: string[];
  whatsapp: string;
  photos: string[];
}

export interface Fixer {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  city: string;
  rating: number;
  completedJobs: number;
  services: string[];
  bio: string;
  joinDate: string;
  location?: Location | null;
  jobOffers: ComponentJobOffer[];
  paymentMethods: string[];
  whatsapp: string;
}
