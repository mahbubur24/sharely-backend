import { Request, Response } from "express";
import apiResponse from "../error/apiResponse";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma";

export const addLike = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.body;
  console.log({ postId });

  try {
    const haveLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: res.locals.user.id,
        },
      },
    });
    if (!haveLike) {
      await prisma.like.create({
        data: {
          Post: { connect: { id: postId } },
          User: { connect: { id: res.locals.user.id } },
        },
      });
    } else {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId: postId,
            userId: res.locals.user.id,
          },
        },
      });
    }

    const totalLike = await prisma.like.count({
      where: {
        postId: postId,
      },
    });

    const response = new apiResponse(200, totalLike, "Like added successfully");
    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    console.log({ error });
  }
});

export const removeLike = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.body;

  await prisma.like.delete({
    where: {
      id: postId,
    },
  });

  const response = new apiResponse(200, "Comment deleted successfully");
  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});
