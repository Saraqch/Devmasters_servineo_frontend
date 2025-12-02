export interface IJobOffer {
    _id?: string;
    fixerId: string;
    fixerName: string;
    fixerWhatsapp: string;
    description: string;
    titulo?: string;// aqui se aumentara titulo en un aproxima actualizacion por el momento  puedes ponerlo Titulo del trabajo
    city: string;
    price: number;
    categories: string[];
    images: string[];
    createdAt?: string;
    updatedAt?: string;
    
}

export interface ICertification {
    _id?: string;
    fixerId: string;
    name: string;
    institution: string;
    issueDate: string;
    expiryDate: string;
    credentialId: string;
    credentialUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IExperience {
    _id?: string;
    fixerId: string;
    jobTitle: string;
    jobType: string;
    organization: string;
    isCurrent: boolean;
    startDate: string;
    endDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPortfolioItem {
    _id?: string;
    fixerId: string;
    type: "image" | "video";
    url: string;
    youtubeUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
}
