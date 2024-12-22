import express from 'express';
import { upload } from "../middleware/multer.middleware.js"
import { authenticate } from "../middleware/auth.middleware.js";

import {
    handleAddComments,
    handleCreateBlog,
    handleDeleteBlog,
    handleDeleteComments,
    handleEditBlog,
    handleGetAllBlogs,
    handleGetAllBlogsByUser,
    handleGetComments,
    handleLikeBlog,
    handleUnlikeBlog
} from '../controllers/blog.controller.js';

const routes = express.Router();

const uploadFile = upload.single("avatar");

//blog operations

routes.post('/create', authenticate, uploadFile, handleCreateBlog);


routes.get('/allBlogs', authenticate, handleGetAllBlogs);

routes.get('/allUserBlogs/:id', authenticate, handleGetAllBlogsByUser);

routes.put('/edit/:id', authenticate,uploadFile, handleEditBlog);

routes.delete('/delete/:id', authenticate, handleDeleteBlog);

//comments operations

routes.post('/addComment/:id', authenticate, handleAddComments);

routes.get('/getComments/:id', authenticate, handleGetComments);

routes.delete('/deleteComment', authenticate, handleDeleteComments);

//likes operations

routes.post('/like/:id', authenticate, handleLikeBlog);

routes.post('/unlike/:id', authenticate, handleUnlikeBlog);

export default routes;