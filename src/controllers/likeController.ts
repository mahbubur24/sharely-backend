import { Request, Response } from "express";
import apiResponse from "../error/apiResponse";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma";

export const addLike = asyncHandler(async (req: Request, res: Response) => {
  const { userId, postId } = req.body;

  const newLike = await prisma.like.create({
    data: {
      Post: { connect: { id: postId } },
      User: { connect: { id: userId } },
    },
  });

  const response = new apiResponse(200, newLike, "Like added successfully");
  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});

export const removeLike = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    await prisma.comment.update({
      where: {
        id: id,
      },
      data: {
        active: false,
      },
    });

    const response = new apiResponse(200, "Comment deleted successfully");
    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  }
);
