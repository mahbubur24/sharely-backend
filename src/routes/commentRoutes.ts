import express from "express";
import { createComment } from "../controllers/commentContorller";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const commentRoutes = express.Router();

commentRoutes.post("/create", isAuthenticated, createComment);

export { commentRoutes };
