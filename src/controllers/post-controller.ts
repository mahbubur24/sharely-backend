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
  console.log({ images });
  console.log(typeof images);

  const postImages = images.map((file) => {
    return file.filename;
  });

  const newPost = await prisma.post.create({
    data: {
      title: title,
      slug: slug,
      content: content,
      categories: modifiedCategories,
      authorId: res.locals.user.id,
      images: postImages,
    },
  });

  await prisma.user.update({
    where: {
      id: res.locals.user.id,
    },
    data: {
      postIds: {
        push: newPost.id,
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: res.locals.user.id,
    },
  });
  console.log({ newPost });
  console.log({ user });

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
