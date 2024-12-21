import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { handleChangeUserPassword, handleGetUserData, handleUserLogin, handleUserLogut, handleUserRegistration, handleUserUpdate } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const routes = Router();

const uploadFile = upload.single("avatar");

routes.post("/register", uploadFile,handleUserRegistration);
routes.post("/login", handleUserLogin);
routes.post("/logout", authenticate, handleUserLogut);
routes.put("/update", authenticate, uploadFile, handleUserUpdate);
routes.put("/update-password",authenticate,handleChangeUserPassword);
routes.get("/userData", authenticate, handleGetUserData);

export default routes;