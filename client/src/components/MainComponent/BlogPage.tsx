import Card from "./Card";
import { useGetBlogsQuery } from "../../store/blog/blogApiSlice";
import Loading from "../Loader/Loading";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  // Render blogs
  return (
    <div className="h-[calc(100vh-5rem)] px-4 overflow-y-auto scrollbar-track-slate-100 scrollbar-thumb-blue-300 scrollbar-thin hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <div className="space-y-8 py-6">
        {data?.data?.sanitizedBlogs?.map((blog: any) => (
          <Card key={blog._id} Blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default BlogPage;