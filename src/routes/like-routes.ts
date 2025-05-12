import express from "express";
import { addLike, removeLike } from "../controllers/likeController";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const likeRoutes = express.Router();

likeRoutes.post("/add", isAuthenticated, addLike);
likeRoutes.post("/remove", isAuthenticated, removeLike);

export { likeRoutes };
