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

authRoutes.post("/registerUser", registerUser);
authRoutes.post("/verifyOTP", verifyOTP);
authRoutes.post("/loginUser", loginUser);
authRoutes.post("/logoutUser", isAuthenticated, logoutUser);
authRoutes.get("/getUser", isAuthenticated, getUser);

export { authRoutes };
