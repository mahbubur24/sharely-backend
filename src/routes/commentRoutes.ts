import express from "express";
import { createComment, getComment } from "../controllers/commentContorller";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const commentRoutes = express.Router();

commentRoutes.post("/create", isAuthenticated, createComment);
commentRoutes.get("/get/:postId", isAuthenticated, getComment);

export { commentRoutes };
