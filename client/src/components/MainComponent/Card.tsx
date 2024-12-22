import { useEffect, useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";

import { useSelector } from "react-redux";
import {
  useDeleteBlogMutation,
  useLikeBlogMutation,
  useUnlikeBlogMutation,
} from "../../store/blog/blogApiSlice";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

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
    _id: "",
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
  const [userBlog, setUserBlog] = useState(false);

  const navigate = useNavigate();

  const user = useSelector((state: any) => state.user.user);

  const [likeBlog] = useLikeBlogMutation();
  const [unlikeBlog] = useUnlikeBlogMutation();

  const [deleteBlog] = useDeleteBlogMutation();

  const handleLikeControl = async () => {
    try {
      if (blog.userLiked) {
        const result = await unlikeBlog(blog._id);
        if ("data" in result) {
          setBlog((prevBlog) => ({
            ...prevBlog,
            userLiked: false,
            likesCount: prevBlog.likesCount - 1,
          }));
        }
      } else {
        const result = await likeBlog(blog._id);
        if ("data" in result) {
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
  };

  const handleEditClick = () => {
    console.log("Blog data being passed:", blog);
    navigate(`/editBlog/${blog._id}`, {
      state: {
        title: blog.title,
        description: blog.description,
        image: blog.image,
      },
    });
  };

  const handleDeleteConfirmation = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col ring-1 ring-black ring-opacity-5`}
          style={{ position: "relative" }}
        >
          <div className="flex-1 p-4">
            <p className="text-lg font-semibold text-gray-900 text-center">
              Do you want to Delete the blog?
            </p>
          </div>

          <div className="flex justify-center gap-4 p-4 border-t border-gray-200">
            <button
              onClick={() => {
                handleDelete();
                toast.dismiss(t.id);
              }}
              className="px-6 py-2 text-sm text-white bg-red-500 hover:bg-red-600 transition-colors rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-6 py-2 text-sm text-white bg-blue-400 hover:bg-blue-500 transition-colors rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const handleDelete = async () => {
    try {
        toast.dismiss();
        
        const response = await deleteBlog(blog._id);
        if ("data" in response) {
            toast.success("Blog deleted successfully");
            navigate("/");
        } else {
            toast.error("Blog couldn't be deleted");
        }
    } catch (error) {
        toast.error("An error occurred while deleting the blog");
        console.log("Error deleting blog:", error);
    }
};


  useEffect(() => {
    setBlog(Blog);

    if (Blog.userName === user.userName) setUserBlog(true);

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
                    <FaHeart className="text-red-500 text-2xl font-bold" />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-2xl hover:text-red-500 font-bold" />
                  )}
                </span>
                <span className="text-gray-600">{blog.likesCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={() => handleCommentClick(blog._id)}
                >
                  <FaRegComment className="text-gray-600 text-2xl hover:text-blue-500 font-bold" />
                </span>
                <span className="text-gray-600">{blog.commentsCount}</span>
              </div>
            </div>
            {userBlog ? (
              <div className="flex gap-4">
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <MdOutlineEdit
                    className="text-gray-600 text-2xl hover:text-green-500 font-bold"
                    onClick={handleEditClick}
                  />
                </div>
                <div
                  className="cursor-pointer hover:scale-110 transition-transform"
                  onClick={handleDeleteConfirmation}
                >
                  <MdDeleteOutline className="text-gray-600 text-2xl hover:text-red-500 font-bold" />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
