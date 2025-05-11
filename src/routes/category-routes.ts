import express from "express";
import {
  allCategory,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/categoryController";

const categoryRoutes = express.Router();

categoryRoutes.post("/create", createCategory);
categoryRoutes.get("/all", allCategory);
categoryRoutes.post("/update", updateCategory);
categoryRoutes.post("/delete", deleteCategory);

export { categoryRoutes };
