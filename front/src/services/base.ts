// store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {API_URL} from "../envs.ts";

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL ?? 'http://localhost:8000/api' }),
  endpoints: () => ({}),
});
