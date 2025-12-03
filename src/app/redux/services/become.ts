import { baseApi } from './baseApi';

export const becomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    convertToFixer: builder.mutation<unknown, { id: string; profile: unknown }>({
      query: ({ id, profile }) => ({
        url: `/user-profiles/${id}/convert-fixer`,
        method: 'PATCH',
        body: { profile },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useConvertToFixerMutation } = becomeApi;
