import { Request, Response } from "express";
import { sendResponse } from "../utils/send-response";

export async function createPost(req: Request, res: Response): Promise<any> {
  //  Send success response after sending email
  const { title, slug, content, categories } = req.body;

  const images = req.files as Express.Multer.File[];
  console.log({ title, slug, content, categories, images });

  const result = req.body;
  return sendResponse(res, {
    success: true,
    message: "welcome",
  });
}
