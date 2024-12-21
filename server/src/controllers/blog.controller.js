import User from "../model/user.model.js";
import { Blog } from "../model/blog.model.js";
import { Comment } from "../model/blog.model.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deleteOnCloudinary, getPublicIdFromUrl, updateOnCloudinary, uploadOnCloudinary } from "../utils/Cloudinary.js";
import mongoose from "mongoose";

const handleCreateBlog = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const avatar = req.file;

    if(!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const userInfo = req.user;
    const user = await User.findById(userInfo._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    let imageUrl = null;
    if (avatar) {
        imageUrl = await uploadOnCloudinary(avatar.path);
        console.log(imageUrl);

        if (!imageUrl) {
            throw new ApiError(500, "Failed to upload image");
        }
    }

    const blog = await Blog.create({
        title,
        description,
        image: imageUrl?.secure_url || Date.now().toString(),
        user: user._id,
    });

    if (!blog) {
        throw new ApiError(500, "Failed to create blog");
    }

    const populatedBlog = await Blog.findById(blog._id)
        .populate('user', 'userName avatar');

    const sanitizedBlog = {
        _id: populatedBlog._id,
        title: populatedBlog.title,
        description: populatedBlog.description,
        image: populatedBlog.image,
        likesCount: blog.likes.length,
        commentsCount: blog.comments.length,
        userName: populatedBlog.user,
        avatar: populatedBlog.user.avatar,
        createdAt: populatedBlog.createdAt,
        userLiked: blog.likes.includes(userInfo._id),
    };

    const response = new ApiResponse(201, "Blog created successfully", {
        sanitizedBlog,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null,
    });
    res.status(response.statusCode).json(response);
})

const handleGetAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).populate('user', 'userName avatar');

    const userId = req.user._id;
    const user = await User.findById(userId);

    const sanitizedBlogs = blogs.map(blog => ({
        _id: blog._id,
        title: blog.title,
        description: blog.description,
        image: blog.image,
        userName: blog.user.userName,
        avatar: blog.user.avatar,
        likesCount: blog.likes.length,
        commentsCount: blog.comments.length,
        createdAt: blog.createdAt,
        userLiked: blog.likes.includes(userId),
    }));

    const response = new ApiResponse(200, "Blogs fetched successfully", {
        sanitizedBlogs,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }|| null,
    });

    res.status(response.statusCode).json(response);
})

const handleGetAllBlogsByUser = asyncHandler(async (req, res) => {
    // console.log(req)
    const userNameorEmail = req.query.userNameorEmail;
    console.log(req.query);
    console.log(userNameorEmail);

    const user = await User.findOne({ $or: [{ userName: userNameorEmail }, { email: userNameorEmail }] })

    console.log(user);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const blogs = await Blog.find({ user: user._id }).populate('user', 'userName avatar');

    const sanitizedBlogs = blogs.map(blog => ({
        _id: blog._id,
        title: blog.title,
        description: blog.description,
        image: blog.image,
        userName: blog.user.userName,
        avatar: blog.user.avatar,
        likesCount: blog.likes.length,
        commentsCount: blog.comments.length,
        createdAt: blog.createdAt,
        userLiked:blog.likes.includes(userId),
    }));

    const response = new ApiResponse(200, "Blogs fetched successfully", {
        sanitizedBlogs,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null,
    });

    res.status(response.statusCode).json(response);
})

const handleEditBlog = asyncHandler(async (req, res) => {

    const blogId = req.query.id || req.params.id;
    const { title, description } = req.body;
    const avatar = req.file;

    if (!blogId || !title || !description) {
        throw new ApiError(400, "All fields are required");
    }

    const userInfo = req.user;
    const user = await User.findById(userInfo._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    if (blog.user.toString() !== user._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this blog");
    }

    let imageUrl = null;
    if (avatar) {

        imageUrl = await updateOnCloudinary(blog.image, avatar.path);

        if (!imageUrl) {
            throw new ApiError(500, "Failed to upload image");
        }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
            title,
            description,
            image: imageUrl?.secure_url || blog.image,
        },
        { new: true }
    ).populate('user', 'userName avatar');

    const sanitizedBlog = {
        _id: updatedBlog._id,
        title: updatedBlog.title,
        description: updatedBlog.description,
        image: updatedBlog.image,
        userName: updatedBlog.user.userName,
        avatar: updatedBlog.user.avatar,
        commentsCount: updatedBlog.comments.length,
        likesCount: updatedBlog.likes.length,
        createdAt: updatedBlog.createdAt,
        userLiked: updatedBlog.likes.includes(userInfo._id),
    };

    const response = new ApiResponse(200, "Blog updated successfully", {
        sanitizedBlog,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null
        });

    res.status(response.statusCode).json(response);
})

const handleDeleteBlog = asyncHandler(async (req, res) => {

    const blogId = req.query.id || req.params.id;
    const userInfo = req.user;

    if (!blogId) {
        throw new ApiError(400, "Blog ID is required");
    }

    const blog = await Blog.findByIdAndDelete(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }
    const user = await User.findById(userInfo._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (blog.user.toString() !== userInfo._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this blog");
    }

    const publicId = getPublicIdFromUrl(blog.image);
    if (publicId) {
        await deleteOnCloudinary(publicId);
    }

    const response = new ApiResponse(200, "Blog deleted successfully", {
        success: true,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null
    });

    res.status(200).json({
       response});

})

const handleAddComments = asyncHandler(async (req, res) => {
    let blogId =  req.params.id;
    const userInfo = req.user;
    const { text : comment } = req.body;

    blogId = new mongoose.Types.ObjectId(blogId);
   
    if (!blogId || !userInfo || !comment) {
        throw new ApiError(400, "All fields are required");
    };

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const user = await User.findById(userInfo._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const newComment = await Comment.create({
        blog: blog._id,
        user: userInfo._id,
        comment
    });

    blog.comments.push(newComment._id);
    await blog.save();

    const populatedComment = await newComment.populate('user', 'userName avatar');

    const response = new ApiResponse(201, "Comment added successfully", {
        populatedComment,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null
});
    res.status(response.statusCode).json(response);
});


const handleGetComments = asyncHandler(async (req, res) => {
    let blogId = req.query.id || req.params.id;
    blogId = new mongoose.Types.ObjectId(blogId);

    const userInfo = req.user;

    if (!blogId || !userInfo) {
        throw new ApiError(400, "Blog ID is required");
    }


    const user = await User.findById(userInfo._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const comments = await Comment.find({
        '_id': { $in: blog.comments }
    }).populate('user', 'userName avatar');

    const sanitizedComments = comments.map(comment => ({
        _id: comment._id,
        text: comment.comment,
        userName: comment.user.userName,
        avatar: comment.user.avatar,
        createdAt: comment.createdAt
    }));

    const response = new ApiResponse(200, "Comments fetched successfully", {
        sanitizedComments,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null
    });

    res.status(response.statusCode).json(response);
});


const handleDeleteComments = asyncHandler(async (req, res) => {
    // const commentId = ;
    const commentId = req.query.id || req.params.id;
    const userInfo = req.user;

    const  user = await User.findById(userInfo._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const blog = await Blog.findById(comment.blog);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    if (comment.user.toString() !== userInfo._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    blog.comments = blog.comments.filter(comment => comment.toString() !== commentId);
    await blog.save();

    const response = new ApiResponse(200, "Comment deleted successfully", {
        success: true,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null
    });
    res.status(response.statusCode).json(response);
});

const handleLikeBlog = asyncHandler(async (req, res) => {

    const blogId = req.query.id || req.params.id;
    const userInfo = req.user;

    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(404, "Blog not found");
    }

    const user = await User.findById(userInfo._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isLiked = blog.likes.includes(userInfo._id);
    if (isLiked) {
        throw new ApiError(400, "You have already liked this blog");
    }

    blog.likes.push(userInfo._id);
    await blog.save();

    const response = new ApiResponse(200, "Blog liked successfully",{
        success: true,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        } || null
    });
    res.status(response.statusCode).json(response);
});

const handleUnlikeBlog = asyncHandler(async (req, res) => {
    // const blogId = ;
    const blogId = req.query.id || req.params.id;

    const userInfo = req.user;

    const blog = await Blog.findById(blogId);
    if (!blog) {
        throw new ApiError(401, "Blog not found");
    }

    const user = await User.findById(userInfo._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    blog.likes.pop(userInfo._id);
    await blog.save();
    const response = new ApiResponse(200, "Blog unliked successfully",{
        success: true,
        UpdatedUser: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }|| null
    });
    
    res.status(response.statusCode).json(response);
});

export {
    handleCreateBlog,
    handleGetAllBlogs,
    handleGetAllBlogsByUser,
    handleEditBlog,
    handleDeleteBlog,
    handleAddComments,
    handleGetComments,
    handleDeleteComments,
    handleLikeBlog,
    handleUnlikeBlog
}