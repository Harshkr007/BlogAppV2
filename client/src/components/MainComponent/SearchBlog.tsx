import { useGetBlogsQuery } from '../../store/blog/blogApiSlice';
import Loading from '../Loader/Loading';
import Card from './Card';
import { useLocation } from 'react-router-dom';

function SearchBlog() {
  const location = useLocation();
  const searchQuery = location.state?.search?.toLowerCase();
  const { data, isLoading, isError } = useGetBlogsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error loading blogs</div>;
  }

  const filteredBlogs = data?.data?.sanitizedBlogs?.filter((blog: any) =>
    blog.title.toLowerCase().includes(searchQuery) ||
    blog.description.toLowerCase().includes(searchQuery) ||
    blog.userName.toLowerCase().includes(searchQuery)
  );

  if (!filteredBlogs || filteredBlogs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-500">
          No Blogs Found
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 overflow-y-auto scrollbar-track-slate-100 scrollbar-thumb-blue-300 scrollbar-thin hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
      <div className="space-y-8 py-6">
        {filteredBlogs.map((blog: any) => (
          <Card key={blog._id} Blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default SearchBlog;
