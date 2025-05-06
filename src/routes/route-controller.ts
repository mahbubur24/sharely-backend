import express from "express";

import { authRoutes } from "./auth-routes";
import { postRouter } from "./post-router";

const routes = express.Router();

routes.use("/api/v1/test", authRoutes);
routes.use("/api/v1/post", postRouter);

export default routes;
