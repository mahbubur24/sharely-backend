import express from "express";
import { createComment, deleteComment } from "../controllers/commentContorller";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const likeRoutes = express.Router();

likeRoutes.post("/add", isAuthenticated, createComment);
likeRoutes.post("/remove", isAuthenticated, deleteComment);

export { likeRoutes };
