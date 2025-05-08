import express from "express";
import { allCategory, createCategory } from "../controllers/categoryController";

const categoryRoutes = express.Router();

categoryRoutes.post("/create", createCategory);
categoryRoutes.get("/all", allCategory);

export { categoryRoutes };
