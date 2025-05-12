import { Request, Response } from "express";
import apiError from "../error/apiError";
import apiResponse from "../error/apiResponse";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma";

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const { comment, postId } = req.body;
    console.log({ comment }, { postId });
    console.log(res.locals.user);

    if (!comment) {
      throw new apiError(400, "comment is required");
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          content: comment,
          Post: { connect: { id: postId } },
          Author: { connect: { id: res.locals.user.id } },
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
    } catch (error) {
      console.log({ error });
    }
  }
);

export const deleteComment = asyncHandler(
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

export const allComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;
  console.log({ id });

  if (!id) return;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: id,
      },
      include: {
        Author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Optional: sort by creation time
      },
    });

    const response = new apiResponse(
      200,
      comments,
      "Comment are fetched successfully"
    );
    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    console.log({ error });
  }
});
