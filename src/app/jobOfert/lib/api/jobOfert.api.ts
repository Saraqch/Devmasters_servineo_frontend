import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface OfferData {
  _id: string;
  fixerName: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  city: string;
  contactPhone: string;
  createdAt: string;
  rating: number;
}

export interface OfferResponse {
  success: boolean;
  total?: number;
  count: number;
  data: OfferData[];
}

interface GetOffersParams {
  search?: string;
  range?: string[];
  city?: string;
  category?: string[];
  sortBy?: string;
  limit?: number;
  skip?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const jobOfertApi = createApi({
  reducerPath: 'jobOfertApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    timeout: 10000,
  }),
  tagTypes: ['Offers'],
  endpoints: (builder) => ({
    getOffers: builder.query<OfferResponse, GetOffersParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.search?.trim()) {
          queryParams.append('search', params.search);
        }

        if (params.range?.length) {
          params.range.forEach((r) => queryParams.append('range', r));
        }

        if (params.city) {
          queryParams.append('city', params.city);
        }

        if (params.category?.length) {
          params.category.forEach((c) => queryParams.append('category', c));
        }

        if (params.sortBy) {
          queryParams.append('sortBy', params.sortBy);
        }

        if (params.limit !== undefined) {
          queryParams.append('limit', String(params.limit));
        }

        if (params.skip !== undefined) {
          queryParams.append('skip', String(params.skip));
        }

        queryParams.append('context', 'job_offer');

        return `/api/devmaster/offers?${queryParams.toString()}`;
      },
      providesTags: ['Offers'],
    }),
  }),
});

export const { useGetOffersQuery } = jobOfertApi;