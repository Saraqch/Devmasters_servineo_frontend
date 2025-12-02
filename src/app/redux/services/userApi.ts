import { baseApi } from "./baseApi"
import type { IUserProfile } from "@/types/job-offer"

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createUserProfile: builder.mutation<IUserProfile, IUserProfile>({
      query: (body) => ({
        url: "/user-profiles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getUserProfiles: builder.query<IUserProfile[], void>({
      query: () => "/user-profiles",
      providesTags: ["User"],
    }),
    updateBio: builder.mutation<IUserProfile, { id: string; bio: string }>({
      query: ({ id, bio }) => ({
        url: `/user-profiles/${id}/bio`,
        method: "PATCH",
        body: { bio },
      }),
      invalidatesTags: ["User"],
    }),
    getUsersByRole: builder.query<IUserProfile[], string>({
      query: (role) => `/user-profiles/role/${role}`,
      providesTags: ["User"],
    }),
    convertToFixer: builder.mutation<IUserProfile, { id: string; profile: IUserProfile["profile"] }>({
      query: ({ id, profile }) => ({
        url: `/user-profiles/${id}/convert-fixer`,
        method: "PATCH",
        body: { profile },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateUserProfileMutation,
  useGetUserProfilesQuery,
  useUpdateBioMutation,
  useGetUsersByRoleQuery,
  useConvertToFixerMutation,
} = userApi
