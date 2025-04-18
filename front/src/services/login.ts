// store/authApi.ts
import { baseApi } from './base.ts';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      transformResponse: (data: {access_token: string}) => {
        return data
      },
      transformErrorResponse: (data) => {
        return data
      }
    }),
  }),
});

export const { useLoginMutation } = authApi;
