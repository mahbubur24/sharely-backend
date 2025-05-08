import express from "express";
import { createPost } from "../controllers/post-controller";
import { upload } from "../middlewares/image-upload-multer";

const postRoutes = express.Router();

postRoutes.post("/create", upload.array("images"), createPost);

export { postRoutes };
