import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (data) => ({
        url: "upload",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    uploadFile: builder.mutation({
      query: (data) => ({
        url: "upload-file",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useUploadImageMutation, useUploadFileMutation } = authApi;
