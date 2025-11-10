import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Configuración de las variables de entorno
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Configuración base para las queries
export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    // Puedes obtener el token del estado si lo necesitas
    // const token = (getState() as RootState).auth.token
    const token = localStorage.getItem('token');
    
    // Si tenemos un token, lo añadimos a los headers
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');
    return headers;
  },
  credentials: 'include',
});

// API base que otros servicios pueden extender
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['Requester', 'Fixer', 'JobOffer'],
});


export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
}


export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error
  );
};