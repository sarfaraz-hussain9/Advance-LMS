import { USER_URL } from "../constant";
import { apiSlice } from "./apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // register user
    register: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/register`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    // login
    login: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/login`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    // logout
    logout: builder.mutation({
      query: () => ({
        url: `${USER_URL}/logout`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    // view profile
    viewProfile: builder.query({
      query: () => ({
        url: `${USER_URL}/me`,
        method: "GET",
        credentials: "include",
      }),
    }),
    // change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/password`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    // update profile
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updateprofile`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    // change profile picture
    changeProfileImg: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/updateprofilepicture`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    // forgot password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/forgetpassword`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    // reset password
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: `${USER_URL}/resetpassword/${token}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    // add to playlist
    addToPlaylist: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/addtoplaylist`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    // remove from playlist
    removeFromPlaylist: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/deletefromplaylist`,
        method: "DELETE",
        credentials: "include",
        body: data,
      }),
    }),

    // *******************

    // Admin Only

    // *******************

    // get all users
    getAllUser: builder.query({
      query: () => ({
        url: `${USER_URL}/admin/users`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // change user role
    updatUserRole: builder.mutation({
      query: ({ data, userId }) => ({
        url: `${USER_URL}/admin/user/${userId}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
    }),
    //  deleteuser
    DeleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USER_URL}/admin/user/${userId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useViewProfileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useChangeProfileImgMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useAddToPlaylistMutation,
  useRemoveFromPlaylistMutation,
  useGetAllUserQuery,
  useUpdatUserRoleMutation,
  useDeleteUserMutation,
} = userApi;
