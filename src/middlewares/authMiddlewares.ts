import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import apiError from "../error/apiError";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma";

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);

    const { token } = req.cookies;
    console.log({ token });

    if (!token) {
      throw new apiError(400, "User not logged in");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (!decoded) {
      throw new apiError(401, "Invalid token");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: (decoded as { id: string }).id,
      },
    });

    if (!user) {
      throw new apiError(401, "User not found");
    }

    res.locals.user = user;

    next();
  }
);
