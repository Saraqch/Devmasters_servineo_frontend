import { baseApi } from './baseApi';
import { IPortfolioItem } from '@/types/fixer-profile';

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Obtener Portafolio por Fixer
    getPortfolioByFixer: builder.query<IPortfolioItem[], string>({
      query: (fixerId) => `/portfolio/fixer/${fixerId}`,
      providesTags: ['Portfolio'], // Se auto-refresca cuando "Portfolio" es invalidado
    }),

    // 2. Crear Item (Imagen o Video)
    createPortfolioItem: builder.mutation<IPortfolioItem, Partial<IPortfolioItem>>({
      query: (body) => ({
        url: '/portfolio',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Portfolio'], // Fuerza la recarga de getPortfolioByFixer
    }),

    // 3. Eliminar Item
    deletePortfolioItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/portfolio/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Portfolio'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPortfolioByFixerQuery,
  useCreatePortfolioItemMutation,
  useDeletePortfolioItemMutation,
} = portfolioApi;
