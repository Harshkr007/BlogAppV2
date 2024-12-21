import React, { useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { useCommentBlogMutation, useGetCommentsQuery } from '../../store/blog/blogApiSlice';
import { useLocation } from 'react-router-dom';
import Loading from '../Loader/Loading';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import { useUpdateUserData } from '../../utils/updateUserData';
import { setCredentials } from '../../store/user/userSlice';

function CommentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const updateUserData = useUpdateUserData();
  const dispatch = useDispatch();

  const [comment, setComment] = useState('');
  const user = useSelector((state: any) => state.user.user);
  dispatch((setCredentials({
    user: user,
    accessToken: user.accessToken,
  })));

  

  const blogId = location.pathname.split('/')[2].replace(':', '');

  //get all comment
  const { data: comments, isLoading ,isError,error} = useGetCommentsQuery(blogId,{
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: false,
    refetchOnFocus: false,
  });

  //comment on a blog
  const [commentBlog] = useCommentBlogMutation();
  
  if(isLoading){
    return <Loading/>
  }else if(!isError){
    console.log(comments?.data?.sanitizedComments);
  }else{
    console.log(error)
    return <p>someting went wrong</p>
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim() === ''){
        toast.error('Comment cannot be empty');
        navigate(`/comment/:${blogId}`)
    }

    console.log(blogId, comment);

    try {
        const response =  await commentBlog({ id: blogId, comment: { text: comment, user: user._id } });
        console.log(response);
        toast.success('Comment added successfully');
        if(response.data.UpdatedUser){
            updateUserData(response.data.UpdatedUser);
        }
        setComment('');
        navigate(`/comment/:${blogId}`)
    } catch (error) {
        console.error('Error submitting comment:', error);
        navigate("/");
    }
  };

  return (
    <div className="w-full h-screen grid grid-rows-5 p-4">
      {/* Comment Input Section */}
      <div className="row-span-1 mb-4">
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 h-full">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
            rows={4}
          />
          <button
            type="submit"
            className="self-end px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 active:bg-blue-700 transition"
          >
            Add Comment
          </button>
        </form>
      </div>

      {/* Comments List Section */}
      <div className="row-span-4 overflow-y-auto  scrollbar-track-slate-100 scrollbar-thumb-blue-300 scrollbar-thin hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full
      mb-14">
        {
           comments?.data?.sanitizedComments?.length > 0 ?(
            comments?.data?.sanitizedComments?.map((comment: any) => (
                    <div key={comment._id} className="mb-4 p-4 border border-gray-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={comment.avatar}
                          alt="user avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="font-medium">{comment.userName}</span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))
            ):<div>No Comments</div>
        }
      </div>
    </div>
  );
}

export default CommentPage;