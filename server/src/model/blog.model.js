import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    blog:{
        type:mongoose.Types.ObjectId,
        ref:"Blog",
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
},{timestamps:true});

const Comment = mongoose.model("Comment",commentSchema);

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        unique:true,   
    },
    likes:[{type:mongoose.Types.ObjectId,ref:"User"}],
    comments:[{
        type:mongoose.Types.ObjectId,
        ref:"Comment"
    }],
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
},{timestamps:true});

export const Blog =  mongoose.model("Blog",blogSchema);
export {Comment};