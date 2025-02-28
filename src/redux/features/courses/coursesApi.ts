import toast from "react-hot-toast";
import { apiSlice } from "../api/apiSlice";
import { setCourse } from "./courseSlice";

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            setCourse({
              course: result.data,
            })
          );
        } catch (error: any) {
          toast.error(error.message);
          console.log(error);
        }
      },
    }),
    editCourse: builder.mutation({
      query: ({ id, data, section }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: { data, section },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            setCourse({
              course: result.data,
            })
          );
        } catch (error: any) {
          toast.error(error.message);
          console.log(error);
        }
      },
    }),
    getAllCourses: builder.query({
      query: (queryParam) => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
        params: queryParam,
      }),
    }),
    getCourseById: builder.query({
      query: (id: any) => ({
        url: `/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCoursesTitle: builder.query({
      query: () => ({
        url: "get-course-title",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
    getCoursesLength: builder.query({
      query: () => ({
        url: "getCoursesLength",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useGetCoursesTitleQuery,
  useDeleteCourseMutation,
  useGetCoursesLengthQuery,
} = coursesApi;
