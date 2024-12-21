import Card from "./Card";
import { useGetBlogsQuery } from "../../store/blog/blogApiSlice";
import Loading from "../Loader/Loading";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateUserData } from "../../utils/updateUserData";
import {  useSelector } from "react-redux";

interface RTKError {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
}

function BlogPage() {
  const { data, isLoading, isError, error } = useGetBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false,
  });

  const updateUserData = useUpdateUserData();
  const user = useSelector((state: any) => state.user);
  console.log(user);

  function isRTKError(error: unknown): error is RTKError {
    return typeof error === "object" && error !== null && "status" in error;
  }

  // Handle loading state
  if (isLoading) {
    return <Loading />;
  }

  // Handle error states
  if (isError) {
    if (isRTKError(error)) {
      toast.error("Invalid user Credentials");
      return <Navigate to="/login" replace />;
    }
    return <div>An unexpected error occurred</div>;
  }

  console.log(data);
  try {
    if (data?.data?.UpdatedUser) {
      console.log(data.data.UpdatedUser);
      updateUserData(data.data.UpdatedUser);
    }
  } catch (error) {
    console.error('Error updating access token:', error);
  }

  // Render blogs
  return (
    <div className="px-4">
      <div className="space-y-8 py-6
       overflow-y-auto  scrollbar-track-slate-100 scrollbar-thumb-blue-300 scrollbar-thin hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        {data?.data?.sanitizedBlogs?.map((blog: any) => (
          <Card key={blog._id} Blog={blog} />
        ))}
      </div>
    </div>
  );

}

export default BlogPage;