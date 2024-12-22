import Card from './Card';
import {useGetUserBlogQuery} from '../../store/blog/blogApiSlice';
import Loading from '../Loader/Loading';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';



function UserBlogs() {
  const user = useSelector((state:any)=>state.user.user);
  const {data,isLoading,isError,error} = useGetUserBlogQuery(user.userName,{
    refetchOnMountOrArgChange:true,
    refetchOnReconnect:false,
    refetchOnFocus:false,
  })

  function isRTKError(error: unknown): error is { status: number } {
    return typeof error === "object" && error !== null && "status" in error;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    if (isRTKError(error)) {
      console.log("Error is here ::",error);
      toast.error("Invalid user Credentials");
      return <Navigate to="/login" replace />;
    }
    return <div>Error loading blogs</div>;
  }

  return (
    <div className="px-4 overflow-y-auto scrollbar-track-slate-100 scrollbar-thumb-blue-300 scrollbar-thin hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <div className="space-y-8 py-6">
        {data?.data?.sanitizedBlogs?.map((blog: any) => (
          <Card key={blog._id} Blog={blog} />
        ))}
      </div>
    </div>
  );
}
export default UserBlogs;