import express from "express";
import {
  allPost,
  createPost,
  deletePost,
  singlePost,
  updatePost,
  userAllPost,
} from "../controllers/post-controller";
import { isAuthenticated } from "../middlewares/authMiddlewares";
import { upload } from "../middlewares/image-upload-multer";

const postRoutes = express.Router();

postRoutes.post("/create", isAuthenticated, upload.array("images"), createPost);
postRoutes.get("/all", allPost);
postRoutes.post("/update", isAuthenticated, upload.array("images"), updatePost);
postRoutes.post("/delete", deletePost);
postRoutes.get("/user-posts", userAllPost);
postRoutes.post("/single", singlePost);

export { postRoutes };
