import express from "express";
import multer from "multer";
import { createPost } from "../controllers/post-controller";
import { upload } from "../middlewares/image-upload-multer";

const postRoutes = express.Router();


postRoutes.post("/create", upload.array("images"), createPost);

postRoutes.post("/check", upload.array("images"), createPost);

export { postRoutes };
