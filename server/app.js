import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config({ path: './.env' });


const app = express();


app.use(express.json());
app.use(cors({
    origin: process.env.CORS_URL, 
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public')); 


//routes import
import userRoutes from "./src/router/user.routes.js";
import blogRoutes from "./src/router/blog.routes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);



app.use((err, req, res, next) => {
    const statusCode = err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";

    console.log("Error here :: ",err);
    
    return res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message,
        errors: err.errors || []
    });
});


export default app;