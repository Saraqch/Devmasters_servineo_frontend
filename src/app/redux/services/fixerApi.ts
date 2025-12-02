// src/app/redux/services/fixerApi.ts
import { baseApi } from './baseApi';
import type { IUserProfile, JobOffer } from '@/types/job-offer';

export const fixerApi = baseApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getFixerById: builder.query<IUserProfile, string>({
      query: (id) => `user-profiles/${id}`,
      providesTags: (result) => result ? [{ type: 'User', id: result.user.id }] : [],
    }),

    getFixers: builder.query<IUserProfile[], void>({
      query: () => 'user-profiles/role/fixer',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user }) => ({ type: 'User' as const, id: user.id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getJobsByFixer: builder.query<JobOffer[], string>({
      query: (fixerId) => `jobs/fixer/${fixerId}`,
      providesTags: (result, error, fixerId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Job' as const, id })),
              { type: 'Job', id: `FIXER-${fixerId}` },
            ]
          : [{ type: 'Job', id: `FIXER-${fixerId}` }],
    }),
  }),
});

export const {
  useGetFixerByIdQuery,
  useGetFixersQuery,
  useGetJobsByFixerQuery,
} = fixerApi;