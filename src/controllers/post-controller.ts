import { Request, Response } from "express";
import { prisma } from "../prisma-client/prisma";
import { sendResponse } from "../utils/send-response";

export async function createPost(req: Request, res: Response): Promise<any> {
  //  Send success response after sending email
  const { title, slug, content, categories } = req.body;
  const modifiedCategories =
    typeof categories === "string" ? [categories] : categories;

  const images = req.files as Express.Multer.File[];
  console.log({ modifiedCategories });

  const newPost = await prisma.post.create({
    data: {
      title: title,
      slug: slug,
      content: content,
      categories: modifiedCategories,
      authorId: res.locals.user.id,
    },
  });

  console.log({ newPost });
  const result = res.locals.user;
  console.log({ result });

  return sendResponse(res, {
    success: true,
    message: "welcome",
  });
}

// export async function check(req: Request, res: Response): Promise<any> {
//   //  Send success response after sending email
//   const { title, postSlug, content, categories } = req.body;

//   const images = req.files as Express.Multer.File[];
//   console.log({ title, postSlug, content, categories, images });

//   const user = prisma.user.findFirst({
//     where: {
//       email: "mahbubur2421@gmail.com",
//     },
//   });

//   console.log({ user });

//   const result = req.body;
//   return sendResponse(res, {
//     success: true,
//     message: "welcome",
//   });
// }
