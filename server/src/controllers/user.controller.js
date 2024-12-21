import User from "../model/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary, getPublicIdFromUrl, updateOnCloudinary } from "../utils/Cloudinary.js";

const cookiesOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};

const handleUserRegistration = asyncHandler(async (req, res) =>{
    const { userName, email, password } = req.body;
    const avatar = req.file;

    if (!userName || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const userExist = await User.findOne({ $or: [{ userName }, { email }] });

    if (userExist) {
        throw new ApiError(409, "User already exists");
    }

    let avatarUrl = null;
    if (avatar) {
        avatarUrl = await uploadOnCloudinary(avatar.path);

        if (!avatarUrl) {
            throw new ApiError(500, "Failed to upload avatar");
        }
    }

    const user = await User.create({
        userName,
        email,
        password,
        avatar: avatarUrl.secure_url,
    });

    if (!user) {
        throw new ApiError(500, "Failed to create user");
    }

    const userData = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    const response = new ApiResponse(201, "User created successfully", userData);
    res.status(response.statusCode).json(response);
});

const handleUserLogin = asyncHandler(async (req, res) => {
    const { userNameOrEmail, password } = req.body;
    console.log(userNameOrEmail, password);

    if (!userNameOrEmail || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const accessToken  = await user.genrateAccessToken();
    const refreshToken = await user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save();

    const response = new ApiResponse(200, "User logged in successfully", {
        user: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        UpdatedUser: null,
    })

    res.cookie("accessToken",accessToken,cookiesOptions)

    res.status(response.statusCode).json(response);
})

const handleUserLogut = asyncHandler(async (req,res) => {

    const userInfo = req.user;

    const user = await User.findById(userInfo._id);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    user.refreshToken = null;
    user.accessToken = null;
    await user.save();

    res.clearCookie("accessToken");

    const response = new ApiResponse(200,"User logged out successfully");
    res.status(response.statusCode).json(response);


})

const handleUserUpdate = asyncHandler(async (req,res) => {

    const {userName,email} = req.body;//here we consider all values are sent by the user
    const avatar = req.file;//may send may not send

    if(!userName || !email){
        throw new ApiError(400,"All fields are required");
    }

    const userInfo = req.user;

    const user = await User.findById(userInfo._id);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    let avatarUrl = null;
    if(avatar){
        avatarUrl = await updateOnCloudinary(
            getPublicIdFromUrl(user.avatar),
            avatar.path
        );

        if(!avatarUrl){
            throw new ApiError(500,"Failed to update avatar");
        }
    }

    user.userName = userName;
    user.email = email;
    user.avatar = avatarUrl?.secure_url || user.avatar;

    const updatedUser = await user.save();

    if(!updatedUser){
        throw new ApiError(500,"Failed to update user");
    }

    const response = new ApiResponse(200,"User updated successfully",{
        user: {
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            accessToken: updatedUser.accessToken,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        },
        UpdatedUser: {
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            accessToken: updatedUser.accessToken,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        } || null,
    })
    res.status(response.statusCode).json(response);
})

const handleChangeUserPassword = asyncHandler(async (req,res) => {
    const {oldPassword,newPassword} = req.body;
    const userInfo = req.user;

    console.log("I am here :: ",oldPassword);
    console.log("I am here :: ",newPassword);
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"All fields are required");
    }
    
    const user = await User.findById(userInfo._id);
    console.log("I am here :: ",user);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    console.log("I am here :: ",isPasswordValid);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid password");
    }

    
    console.log("I am here old password :: ",user.password);
    user.password = newPassword;
    const updatedUser = await user.save();
    console.log("I am here new password :: ",updatedUser.password);
    console.log("I am here :: ",updatedUser);

    if(!updatedUser){
        throw new ApiError(500,"Failed to update password");
    }

    const response = new ApiResponse(200,"Password updated successfully",{
        user:{
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            accessToken: updatedUser.accessToken,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        },
        UpdatedUser: {
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            accessToken: updatedUser.accessToken,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        } || null,
    });

    res.status(response.statusCode).json(response);
});

const handleGetUserData = asyncHandler(async (req,res) => {
    const userInfo = req.user;

    const user = await User.findById(userInfo._id);

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const response = new ApiResponse(200,"User data fetched successfully",{
        user: {
            _id: user._id,
            userName: user.userName,
            email: user.email,
            avatar: user.avatar,
            accessToken: user.accessToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        },
        newToken: userInfo?.accessToken || null,
    })

    res.status(response.statusCode).json(response);
})//no needed



export {
    handleUserRegistration,
    handleUserLogin,
    handleUserLogut,
    handleUserUpdate,
    handleChangeUserPassword,
    handleGetUserData
}