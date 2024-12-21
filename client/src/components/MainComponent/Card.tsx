import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";


import { baseURL } from "../../utils/baseURL";
import { useSelector,useDispatch } from "react-redux";
import { useLikeBlogMutation,useUnlikeBlogMutation } from "../../store/blog/blogApiSlice";
import { useNavigate } from "react-router-dom";

function Card({
  Blog,
}: {
  Blog: {
    _id: string;
    avatar: string;
    userName: string;
    title: string;
    description: string;
    image: string;
    date: string;
    likesCount: number;
    commentsCount: number;
    userLiked: boolean;
  };
}) {
  const [blog, setBlog] = useState({
    _id : "",
    avatar: "",
    userName: "",
    title: "",
    description: "",
    image: "",
    date: "",
    likesCount: 0,
    commentsCount: 0,
    userLiked: false,
  });
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user.user);

  const [likeBlog] = useLikeBlogMutation();
  const [unlikeBlog] = useUnlikeBlogMutation();


  const handleLikeControl = async () => {
    try {
      if (blog.userLiked) {
        const result = await unlikeBlog(blog._id);
        if ('data' in result) {
          setBlog((prevBlog) => ({
            ...prevBlog,
            userLiked: false,
            likesCount: prevBlog.likesCount - 1,
          }));
        }
      } else {
        const result = await likeBlog(blog._id);
        if ('data' in result) {
          setBlog((prevBlog) => ({
            ...prevBlog,
            userLiked: true,
            likesCount: prevBlog.likesCount + 1,
          }));
        }
      }
    } catch (error) {
      console.error("Error liking/unliking blog:", error);
    }
  };

 const handleCommentClick = (blogId: string) => {
  navigate(`/comment/${blogId}`);

 }


  useEffect(() => {
    setBlog(Blog);

    console.log(Blog);
  }, [Blog]);
  
  return (
    <div className="max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="grid grid-cols-4 gap-6 p-6">
        {/* Image Section - 1/4 width */}
        <div className="col-span-1">
          <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={blog.image}
              alt="blogImage"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section - 3/4 width */}
        <div className="col-span-3 grid grid-rows-[auto_1fr_auto] gap-4">
          {/* User Info Section */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                <img
                  src={blog.avatar}
                  alt="userImage"
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="font-medium text-gray-800">{blog.userName}</span>
            </div>
            <div className="text-gray-500 text-sm">
              <span>{blog.date}</span>
            </div>
          </div>

          {/* Blog Content Section */}
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold text-gray-900">
              {blog.title}
            </span>
            <span className="text-gray-600 line-clamp-2">
              {blog.description}
            </span>
          </div>

          {/* Interaction Section */}
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span 
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={handleLikeControl}
                >
                  {blog.userLiked ? (
                    <FaHeart 
                    className="text-red-500 text-2xl font-bold"
                    
                    />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-2xl hover:text-red-500 font-bold" />
                  )}
                </span>
                <span className="text-gray-600">{blog.likesCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleCommentClick(blog._id)}
                >
                  <FaRegComment className="text-gray-600 text-2xl hover:text-blue-500 font-bold" />
                </span>
                <span className="text-gray-600">{blog.commentsCount}</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="cursor-pointer hover:scale-110 transition-transform">
                <MdOutlineEdit className="text-gray-600 text-2xl hover:text-green-500 font-bold" />
              </div>
              <div className="cursor-pointer hover:scale-110 transition-transform">
                <MdDeleteOutline className="text-gray-600 text-2xl hover:text-red-500 font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
