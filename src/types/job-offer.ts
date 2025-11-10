// In src/types/job-offer.ts
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
  // Add other fields as needed
}