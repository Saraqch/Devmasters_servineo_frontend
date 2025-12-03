// src/app/redux/services/experienceApi.ts
import { baseApi } from './baseApi';
import type { IExperience } from '@/types/fixer-profile';
export const experienceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Crear experiencia
    createExperience: builder.mutation<IExperience, Partial<IExperience>>({
      query: (body) => ({
        url: '/experiences',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Experience'],
    }),

    // Obtener experiencias por fixer
    getExperiencesByFixer: builder.query<IExperience[], string>({
      query: (fixerId) => `/experiences/fixer/${fixerId}`,
      providesTags: ['Experience'],
    }),

    // Actualizar experiencia
    updateExperience: builder.mutation<IExperience, { id: string; data: Partial<IExperience> }>({
      query: ({ id, data }) => ({
        url: `/experiences/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Experience'],
    }),

    // Eliminar experiencia
    deleteExperience: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/experiences/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Experience'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateExperienceMutation,
  useGetExperiencesByFixerQuery,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;
