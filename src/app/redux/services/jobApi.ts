import { baseApi } from './baseApi';
import { IJobOffer } from '@/types/fixer-profile';

interface ApiResponse {
  data: IJobOffer[];
  count: number;
  success?: boolean;
}

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query<IJobOffer[], void>({
      query: () => '/job-offers',
      providesTags: ['Job'],
    }),

    getJobsByFixer: builder.query<IJobOffer[], string>({
      query: (fixerId) => `/job-offers/fixer/${fixerId}`,
      transformResponse: (response: ApiResponse) => {
        return response.data;
      },
      providesTags: ['Job'],
    }),

    createJob: builder.mutation<IJobOffer, FormData>({
      query: (formData) => ({
        url: '/job-offers',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Job'],
    }),
    // ---------------------------

    updateJob: builder.mutation<IJobOffer, { jobId: string; formData: Partial<FormData> }>({
      query: ({ jobId, formData }) => ({
        url: `/job-offers/${jobId}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Job'],
    }),

    // solo se necesita el id del la offerta
    deleteJob: builder.mutation<{ message: string }, { jobId: string; fixerId: string }>({
      query: ({ jobId, fixerId }) => ({
        url: `/job-offers/${jobId}`,
        method: 'DELETE',
        body: { fixerId },
      }),
      invalidatesTags: ['Job'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllJobsQuery,
  useGetJobsByFixerQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
