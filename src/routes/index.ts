import express from "express";
import authRouter from "./auth";

const router = express.Router();

router.use("/api/v1/test", authRouter);

export default router;
