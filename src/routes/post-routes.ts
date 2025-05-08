import express from "express";
import { createPost } from "../controllers/post-controller";
import { isAuthenticated } from "../middlewares/authMiddlewares";
import { upload } from "../middlewares/image-upload-multer";

const postRoutes = express.Router();

postRoutes.post("/create", isAuthenticated, upload.array("images"), createPost);

export { postRoutes };
