import express, { Request, Response } from "express";

import { authRoutes } from "./auth-routes";
import { categoryRoutes } from "./category-routes";
import { commentRoutes } from "./comment-Routes";
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
routes.use("/test", (_req: Request, res: Response) => {
  res.send("Welcome to sharely blog");
});

export default routes;
