import React, { useState } from 'react';
import { useCommentBlogMutation, useGetCommentsQuery } from '../../store/blog/blogApiSlice';
import { useLocation } from 'react-router-dom';
import Loading from '../Loader/Loading';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';

function CommentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [comment, setComment] = useState('');

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
        const response =  await commentBlog({ id: blogId, comment: { text: comment} });
        console.log(response);
        toast.success('Comment added successfully');
        setComment('');
        navigate(`/comment/:${blogId}`)
    } catch (error) {
        console.error('Error submitting comment:', error);
        navigate("/");
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] p-4 flex flex-col">
      {/* Comment Input Section */}
      <div className="flex-shrink-0 mb-4">
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="flex-grow overflow-y-auto scrollbar-track-slate-100 scrollbar-thumb-blue-300 scrollbar-thin hover:scrollbar-thumb-blue-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
        {comments?.data?.sanitizedComments?.length > 0 ? (
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
        ) : (
          <div className="text-center text-gray-500">No Comments</div>
        )}
      </div>
    </div>
  );
}

export default CommentPage;