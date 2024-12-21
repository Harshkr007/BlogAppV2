import ApiError from "../utils/ApiError.js";

export const validateBlogInput = (req, res, next) => {
    const { title, description } = req.body;
    
    if (!title?.trim()) {
        throw new ApiError(400, "Blog title is required");
    }
    
    if (!description?.trim()) {
        throw new ApiError(400, "Blog description is required");
    }
    
    if (title.length < 3) {
        throw new ApiError(400, "Blog title must be at least 3 characters long");
    }
    
    if (description.length < 10) {
        throw new ApiError(400, "Blog description must be at least 10 characters long");
    }
    
    next();
};

