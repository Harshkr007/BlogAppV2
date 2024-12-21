import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

import ApiError from './ApiError.js';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
   cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME),
   api_key: String(process.env.CLOUDINARY_API_KEY),
   api_secret: String(process.env.CLOUDINARY_API_SECRET)
});

const uploadOnCloudinary = async (localFilePath) => {
   if (!localFilePath) return null;

   try {
       const response = await cloudinary.uploader.upload(localFilePath, {
           folder: "Blog",
           resource_type: "auto",
           quality: "auto",
       });
       return response;
   } catch (error) {
       console.error("Error uploading to Cloudinary:", error);
       return null;
   } finally {
       if (fs.existsSync(localFilePath)) {
           fs.unlinkSync(localFilePath);
       }
   }
};

const deleteOnCloudinary = async (publicId) => {
   if (!publicId) return null;

   try {
       return await cloudinary.uploader.destroy(publicId);
   } catch (error) {
       console.error("Error deleting on Cloudinary:", error);
       return null;
   }
};

const updateOnCloudinary = async (publicId, localFilePath) => {

    try {
        if (!publicId || !localFilePath){
            throw new ApiError(400, "Invalid publicId or localFilePath");
        }
        
        const deleteavatar = await deleteOnCloudinary(publicId);
      

        if (!deleteavatar) {
            throw new ApiError(400, "Error deleting on Cloudinary");
        }

        const response = await uploadOnCloudinary(localFilePath);

        if (!response) {
            throw new ApiError(400, "Error uploading to Cloudinary");
        }


        return response;
    } catch (error) {
        throw new ApiError(400, "Error updating on Cloudinary");
    }
}

const getPublicIdFromUrl = (url) => {
   const publicIdRegex = /\/([^/]+)\.[^/]+$/;
   const match = url.match(publicIdRegex);
   return match ? `Blog/${match[1].trim()}` : null;
};

export { uploadOnCloudinary, deleteOnCloudinary,updateOnCloudinary, getPublicIdFromUrl };
