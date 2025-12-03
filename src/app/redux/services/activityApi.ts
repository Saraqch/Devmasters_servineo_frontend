import { baseApi } from './baseApi';

export interface ActivityData {
  userId: string;
  date: string;
  role: string;
  type: string;
  metadata: {
    button: string;
    jobTitle: string;
    jobId: string;
  };
  timestamp: string;
}

export const activityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logClick: builder.mutation<void, ActivityData>({
      query: (activityData) => ({
        url: '/ActivityReviews',
        method: 'POST',
        body: activityData,
      }),
      invalidatesTags: ['Requester'],
    }),
  }),
});

export const { useLogClickMutation } = activityApi;
