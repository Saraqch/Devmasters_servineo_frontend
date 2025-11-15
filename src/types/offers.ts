

export interface OfferData {
  _id: string;
  id?: string;
  fixerId?: string;
  userId?: string;
  fixerName: string; // REQUERIDO
  fixerPhoto?: string;
  title: string;
  description: string;
  tags: string[]; // REQUERIDO (array, no opcional)
  contactPhone: string; // REQUERIDO
  photos?: string[];
  imagenUrl?: string;
  category: string;
  price: number;
  createdAt: string | Date;
  city: string; // REQUERIDO
  rating?: number;
  completedJobs?: number;
  allImages?: string[];
  imagenAsignada?: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
}

export interface OfferResponse {
  total: number;
  count: number;
  data: OfferData[];
  currentPage?: number;
}

export interface AdaptedOffer {
  id: string;
  fixerId: string;
  fixerName: string;
  fixerPhoto?: string;
  title: string;
  description: string;
  tags: string[];
  whatsapp: string;
  photos: string[];
  services: string[];
  price: number;
  createdAt: Date;
  city: string;
  rating?: number;
  completedJobs: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}