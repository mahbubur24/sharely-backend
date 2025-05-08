import { Request, Response } from "express";
import apiError from "../error/apiError";
import apiResponse from "../error/apiResponse";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    if (!name) {
      throw new apiError(400, "Category name is required");
    }

    const newCategory = await prisma.categories.create({
      data: {
        name: name,
      },
    });

    const response = new apiResponse(200, "Category created successfully");
    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  }
);

export const allCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany();

    const response = new apiResponse(
      200,
      categories,
      "Category fetched successfully"
    );
    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  } catch (error) {
    throw new apiError(400, "Can't fetch Category");
  }
});

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const categoryID = req.body;

    const categories = await prisma.categories.findUnique({
      where: { id: categoryID },
    });
  }
);
