import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosResponse } from 'axios';

import ApiService from './ApiService';

const axiosBaseQuery: BaseQueryFn<
  {
    functionName: string;
    headers?: Record<string, string>;
    header?: Record<string, any>;
    body?: Record<string, any>;
  }, // Args
  unknown, // Result
  unknown // Error
> = async ({ functionName, headers, header, body }) => {
  try {
    // Call ApiService.fetch to make the request
    const result: AxiosResponse = await ApiService.fetch({
      functionName,
      headers,
      header,
      body,
    });

    // Return the data to RTK Query
    return { data: result.data };
  } catch (axiosError) {
    const err = axiosError as AxiosError;

    // Return a standardized error for RTK Query
    return {
      error: {
        status: err.response?.status || 'FETCH_ERROR',
        data: err.response?.data || err.message,
      },
    };
  }
};
// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getAccounts: builder.query({
      queryFn: async () => {
        try {
          return { data: 'alo' };
        } catch (error) {
          // Catch any errors and return them as an object with an `error` field
          return { error };
        }
      },
    }),
  }),
});
export const { useGetAccountsQuery } = api;
