import { Request, Response } from "express";
import apiError from "../error/apiError";
import apiResponse from "../error/apiResponse";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma";
import { sendResponse } from "../utils/send-response";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    console.log({ name });

    if (!name) {
      throw new apiError(400, "Category name is required");
    }

    try {
      const newCategory = await prisma.category.create({
        data: {
          name: name,
        },
      });
      return sendResponse(res, {
        success: true,
        data: newCategory,
        message: "create category successfully",
      });
    } catch (error) {
      return sendResponse(res, {
        success: false,
      });
    }
  }
);

export const allCategory = asyncHandler(async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();

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

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, name } = req.body;
    console.log({ name });

    if (!name) {
      throw new apiError(400, "Category name is required");
    }

    try {
      const updatedCategory = await prisma.category.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
      const response = new apiResponse(
        200,
        updatedCategory,
        "Category created successfully"
      );
      res.status(response.statusCode).json({
        success: response.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      return sendResponse(res, {
        success: false,
      });
    }
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.body;

    try {
      await prisma.category.update({
        where: { id: id },
        data: {
          active: false,
        },
      });
      const response = new apiResponse(
        200,

        "Category deleted successfully"
      );
      res.status(response.statusCode).json({
        success: response.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      return sendResponse(res, {
        success: true,
      });
    }
  }
);
