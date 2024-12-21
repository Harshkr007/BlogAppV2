import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../utils/baseURL.js";

const baseQuery = fetchBaseQuery({
  baseUrl: `${baseURL}/api/v1/blog`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as { user: { accessToken: string } }).user.accessToken;
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQuery,
  tagTypes: ["Blogs", "comments"],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => "/allBlogs",
      providesTags: ["Blogs"],
    }),

    getUserBlog: builder.query({
      query: (id) => `/allUserBlogs/${id}`,
      providesTags: ["Blogs"],
    }),

    createBlog: builder.mutation({
      query: (blog) => ({
        url: "/create",
        method: "POST",
        body: blog,
      }),
      invalidatesTags: ["Blogs"],
    }),

    updateBlog: builder.mutation({
      query: ({ id, blog }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: blog,
      }),
      invalidatesTags: ["Blogs"],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),

    getComments: builder.query({
      query: (id) => `/getComments/${id}`,
      providesTags: ["comments"],
    }),

    commentBlog: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/addComment/${id}`,
        method: "POST",
        body: comment,
      }),
      invalidatesTags: ["Blogs", "comments"],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/deleteComment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs", "comments"],
    }),

    likeBlog: builder.mutation({
      query: (id) => ({
        url: `/like/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Blogs"],
    }),

    unlikeBlog: builder.mutation({
      query: (id) => ({
        url: `/unlike/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetUserBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetCommentsQuery,
  useCommentBlogMutation,
  useDeleteCommentMutation,
  useLikeBlogMutation,
  useUnlikeBlogMutation,
} = blogApi;

export default blogApi;
