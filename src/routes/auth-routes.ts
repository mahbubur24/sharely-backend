import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyOTP,
} from "../controllers/authControllers";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const authRoutes = express.Router();

authRoutes.post("/signup", registerUser);
authRoutes.post("/verifyOTP", verifyOTP);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", isAuthenticated, logoutUser);
authRoutes.post("/getUser",isAuthenticated, getUser);

export { authRoutes };
