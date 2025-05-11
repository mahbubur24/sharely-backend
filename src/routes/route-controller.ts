import express from "express";

import { authRoutes } from "./auth-routes";
import { categoryRoutes } from "./category-routes";
import { commentRoutes } from "./commentRoutes";
import { disLikeRoutes } from "./dis-like-routes";
import { likeRoutes } from "./like-routes";
import { postRoutes } from "./post-routes";

const routes = express.Router();

routes.use("/api/v1/auth", authRoutes);
routes.use("/api/v1/post", postRoutes);
routes.use("/api/v1/category", categoryRoutes);
routes.use("/api/v1/comment", commentRoutes);
routes.use("/api/v1/like", likeRoutes);
routes.use("/api/v1/dislike", disLikeRoutes);

export default routes;
