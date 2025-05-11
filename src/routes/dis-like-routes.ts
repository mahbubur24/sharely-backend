import express from "express";
import { createComment, deleteComment } from "../controllers/commentContorller";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const disLikeRoutes = express.Router();

disLikeRoutes.post("/add", isAuthenticated, createComment);
disLikeRoutes.post("/remove", isAuthenticated, deleteComment);

export { disLikeRoutes };
