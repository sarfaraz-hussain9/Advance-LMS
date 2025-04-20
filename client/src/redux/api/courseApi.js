import { COURSE_URL } from "../constant";
import { apiSlice } from "./apiSlice";

const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all courses
    getCourses: builder.query({
      query: () => ({
        url: `${COURSE_URL}/courses`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Course"],
    }),

    // Create new course
    createCourse: builder.mutation({
      query: (data) => ({
        url: `${COURSE_URL}/createcourse`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),

    // Get course lectures
    getCourseLectures: builder.query({
      query: (id) => ({
        url: `${COURSE_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Lecture"],
    }),

    getCourseDetails: builder.query({
      query: (id) => ({
        url: `${COURSE_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Course"],
    }),

    // Add lecture to course
    addLecture: builder.mutation({
      query: ({ id, data }) => ({
        url: `${COURSE_URL}/${id}`,
        method: "POST",
        body: data,
        formData: true,
        credentials: "include",
      }),
      invalidatesTags: ["Lecture"],
    }),

    // Delete course
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `${COURSE_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),

    // Delete lecture
    deleteLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `${COURSE_URL}/lecture`,
        method: "DELETE",
        body: { courseId, lectureId },
        credentials: "include",
      }),
      invalidatesTags: ["Lecture"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useGetCourseLecturesQuery,
  useGetCourseDetailsQuery,
  useAddLectureMutation,
  useDeleteCourseMutation,
  useDeleteLectureMutation,
} = courseApi;
