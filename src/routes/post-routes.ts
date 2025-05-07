import express from "express";
import multer from "multer";
import { createPost } from "../controllers/post-controller";

const postRoutes = express.Router();

const upload = multer({ dest: "uploads/" });
postRoutes.post("/create", upload.array("images"), createPost);

export { postRoutes };
