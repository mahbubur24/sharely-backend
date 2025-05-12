import express from "express";
import { allComment, createComment, deleteComment } from "../controllers/commentContorller";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const commentRoutes = express.Router();

commentRoutes.post("/create", isAuthenticated, createComment);
commentRoutes.post("/delete", isAuthenticated, deleteComment);
commentRoutes.post("/all", allComment);

export { commentRoutes };
