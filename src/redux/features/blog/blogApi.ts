'use client';
import { apiSlice } from '../api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createBlog: builder.mutation({
      query: data => ({
        url: 'create-blog',
        method: 'POST',
        body: data,
        credentials: 'include' as const,
      }),
    }),
    getAllBlogs: builder.query({
      query: queryParam => ({
        url: 'get-blogs',
        method: 'GET',
        credentials: 'include' as const,
        params: queryParam,
      }),
    }),
    getBlogById: builder.query({
      query: (id: any) => ({
        url: `/get-blogs/${id}`,
        method: 'GET',
        credentials: 'include' as const,
      }),
    }),
    editBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/edit-blog/${id}`,
        method: 'PUT',
        body: { data },
        credentials: 'include' as const,
      }),
    }),
    deleteBlog: builder.mutation({
      query: id => ({
        url: `/delete-blog/${id}`,
        method: 'DELETE',
        credentials: 'include' as const,
      }),
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useEditBlogMutation,
  useDeleteBlogMutation,
} = authApi;
