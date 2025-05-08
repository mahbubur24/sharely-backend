import { Request, Response } from "express";
import apiError from "../error/apiError";
import apiResponse from "../error/apiResponse";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma";

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { comment, postId } = req.body;

    if (!comment) {
      throw new apiError(400, "comment is required");
    }

    const newComment = await prisma.comment.create({
      data: {
        content: comment,
        postId: postId,
        userId: res.locals.user.id,
      },
    });

    const response = new apiResponse(
      200,
      newComment,
      "Comment created successfully"
    );
    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  }
);

export const getComment = asyncHandler(async (req: Request, res: Response) => {
  try {
    const comment = await prisma.comment.findMany({
      where: { postId: req.params.postId },
    });

    const response = new apiResponse(
      200,
      comment,
      "comment fetched successfully"
    );
    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    throw new apiError(400, "Can't fetch comment");
  }
});
