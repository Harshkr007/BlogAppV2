import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../model/user.model.js';

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Missing Credentials");
        }

        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.log("Error at Auth :: ",error);
        if (error?.name === 'TokenExpiredError') {
            try {
                const user = await User.findOne({ accessToken: token });

                if (!user || !user.refreshToken) {
                    throw new ApiError(401, "Invalid or expired session");
                }

                const decodedRefreshToken = await jwt.verify(
                    user.refreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                );

                const newAccessToken = await user.genrateAccessToken();
                const newRefreshToken = await user.genrateRefreshToken();

                user.refreshToken = newRefreshToken;
                user.accessToken = newAccessToken;
                await user.save();

                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });

                req.user = decodedRefreshToken;
                req.user.accessToken = newAccessToken;
                next();
            } catch (refreshError) {
                throw new ApiError(401, "Session expired. Please login again");
            }
        }
        throw new ApiError(401, "Invalid access token");
    }
};

export { authenticate };
