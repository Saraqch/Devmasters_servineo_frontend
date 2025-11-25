// src\app\redux\services\userApi.ts
import { baseApi } from './baseApi';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // Invalidar cache después del login
      invalidatesTags: ['Requester'],
    }),

    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['Requester'],
    }),

    updateUser: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Requester'],
    }),

    getProfile: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['Requester'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useGetProfileQuery,
} = userApi;