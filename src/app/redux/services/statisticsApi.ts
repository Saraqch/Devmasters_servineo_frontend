import { baseApi } from './baseApi';

export interface JobStatusMetadata {
  completed: number;
  pending: number;
  inProgress: number;
  total: number;
  collectionDate: string;
}

export interface JobLog {
  _id: string;
  userId: string;
  date: string;
  role: 'visitor' | 'requester' | 'fixer';
  type:
    | 'login'
    | 'search'
    | 'click'
    | 'review'
    | 'session_start'
    | 'session_end'
    | 'daily_jobs_status';
  metadata: JobStatusMetadata;
  timestamp: string;
}

export const statisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobStatistics: builder.query<JobLog[], void>({
      query: () => '/activity/ActivityReviews',
      providesTags: ['Statistics'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetJobStatisticsQuery } = statisticsApi;
