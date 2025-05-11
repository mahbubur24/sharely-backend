import express from "express";
import {
  forgotPassword,
  getUser,
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyOTP,
} from "../controllers/authControllers";
import { isAuthenticated } from "../middlewares/authMiddlewares";

const authRoutes = express.Router();

authRoutes.post("/signup", registerUser);
authRoutes.post("/verifyOTP", verifyOTP);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", isAuthenticated, logoutUser);
authRoutes.get("/getUser", isAuthenticated, getUser);
authRoutes.post("/forgotPassword", forgotPassword);
authRoutes.put("/resetPassword/:token", resetPassword);
authRoutes.post("/getuserData", getUserData);

export { authRoutes };
