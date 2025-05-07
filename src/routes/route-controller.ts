import express from "express";

import { authRoutes } from "./auth-routes";
import { postRoutes } from "./post-routes";

const routes = express.Router();


routes.use("/api/v1/auth", authRoutes);
routes.use("/api/v1/post", postRoutes);

export default routes;
