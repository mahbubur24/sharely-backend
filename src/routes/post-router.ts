import express from "express";
import { createPost } from "../controllers/post-controller";

const postRouter = express.Router();

postRouter.post("/create", createPost);

export { postRouter };
