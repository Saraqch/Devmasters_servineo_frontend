import { baseApi } from "./baseApi"
import type { IJob } from "@/types/job-offer"

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.query<IJob[], void>({
      query: () => "/jobs",
      providesTags: ["Job"],
    }),
    getJobsByFixer: builder.query<IJob[], string>({
      query: (fixerId) => `/jobs/fixer/${fixerId}`,
      providesTags: ["Job"],
    }),
    createJob: builder.mutation<IJob, Omit<IJob, "_id">>({
      query: (body) => ({
        url: "/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Job"],
    }),
    updateJob: builder.mutation<IJob, { jobId: string; data: Partial<IJob> & { fixerId: string } }>({
      query: ({ jobId, data }) => ({
        url: `/jobs/${jobId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    deleteJob: builder.mutation<{ message: string }, { jobId: string; fixerId: string }>({
      query: ({ jobId, fixerId }) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
        body: { fixerId },
      }),
      invalidatesTags: ["Job"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllJobsQuery,
  useGetJobsByFixerQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi
