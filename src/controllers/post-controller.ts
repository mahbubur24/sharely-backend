import { Request, Response } from "express";
import { prisma } from "../prisma-client/prisma";
import { sendResponse } from "../utils/send-response";

export async function createPost(req: Request, res: Response): Promise<any> {
  //  Send success response after sending email
  const { title, slug, content, categories } = req.body;
  const modifiedCategories =
    typeof categories === "string" ? [categories] : categories;
  console.log({ modifiedCategories });

  const images = req.files as Express.Multer.File[];
  console.log({ modifiedCategories });
  console.log({ images });
  console.log(typeof images);

  try {
    const postImages = images.map((file) => {
      return file.filename;
    });

    let newSlug = slug;

    let suffix = (await prisma.post.count()) ?? 1;
    console.log({ suffix });

    newSlug = `${slug}-${suffix++}`;
    while (true) {
      const existing = await prisma.post.findUnique({
        where: { slug: newSlug },
      });

      if (!existing) break;

      newSlug = `${slug}-${suffix++}`;
    }
    console.log({ newSlug });

    const newPost = await prisma.post.create({
      data: {
        title: title,
        slug: newSlug,
        content: content,
        images: postImages,
        Author: { connect: { id: res.locals.user.id } }, // authorId = logged-in user ID
        PostCategories: {
          create: modifiedCategories.map((categoryId: string) => ({
            Category: { connect: { id: categoryId } },
          })),
        },
      },
    });

    return sendResponse(res, {
      success: true,
      data: newPost,
      message: "welcome",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse(res, {
      success: false,
      message: "Post Create Failled",
    });
  }
}

export async function allPost(_: Request, res: Response): Promise<any> {
  try {
    const allPost = await prisma.post.findMany({
      include: {
        Author: {
          select: {
            id: true,
            name: true,
          },
        },
        PostCategories: true,
        Comments: true,
        Likes: true,
        Dislikes: true,
      },
    });
    console.log(allPost[0].Author);

    return sendResponse(res, {
      success: true,
      data: allPost,
      message: "All post fetched successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,

      message: "Something went wrong",
    });
  }
}

export async function updatePost(req: Request, res: Response): Promise<any> {
  //  Send success response after sending email
  const { title, slug, content, categories } = req.body;
  const modifiedCategories =
    typeof categories === "string" ? [categories] : categories;

  const images = req.files as Express.Multer.File[];
  console.log({ modifiedCategories });
  console.log({ images });
  console.log(typeof images);

  try {
    const postImages = images.map((file) => {
      return file.filename;
    });
    let newSlug = slug;

    let suffix = (await prisma.post.count()) ?? 1;
    while (true) {
      const existing = await prisma.post.findUnique({
        where: { slug: newSlug },
      });

      if (!existing) break;

      newSlug = `${slug}-${suffix++}`;
    }

    const updatedPost = await prisma.post.update({
      where: { id: req.body.id },
      data: {
        title: title,
        slug: newSlug,
        content: content,
        images: postImages,
        Author: { connect: { id: res.locals.user.id } }, // authorId = logged-in user ID
        PostCategories: {
          create: modifiedCategories.map((categoryId: string) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      },
    });

    return sendResponse(res, {
      success: true,
      data: updatedPost,
      message: "welcome",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: "update post failled",
    });
  }
}

export async function deletePost(req: Request, res: Response): Promise<any> {
  //  Send success response after sending email
  const { id } = req.body;

  const updatedPost = await prisma.post.update({
    where: { id: id },
    data: {
      active: false,
    },
  });

  return sendResponse(res, {
    success: true,
    data: updatedPost,
    message: "welcome",
  });
}

export async function userAllPost(req: Request, res: Response): Promise<any> {
  const { id } = req.body;
  try {
    const allPost = await prisma.post.findMany({
      where: {
        authorId: id,
      },
      include: {
        Author: {
          select: {
            id: true,
            name: true,
          },
        },
        PostCategories: true,
        Comments: true,
        Likes: true,
        Dislikes: true,
      },
    });

    return sendResponse(res, {
      success: true,
      data: allPost,
      message: "All post fetched successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,

      message: "Something went wrong",
    });
  }
}

export async function singlePost(req: Request, res: Response): Promise<any> {
  const { slug } = req.body;
  console.log({ slug });

  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: slug,
      },
      include: {
        Author: {
          select: {
            id: true,
            name: true,
          },
        },
        PostCategories: true,
        Comments: true,
        _count: {
          select: {
            Likes: true,
            Dislikes: true,
          },
        },
      },
    });

    return sendResponse(res, {
      success: true,
      data: post,
      message: "All post fetched successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function categoryPost(req: Request, res: Response): Promise<any> {
  const { category } = req.body;

  try {
    // const posts = await prisma.post.findMany({
    //   where: {
    //     PostCategories: {
    //       some: {
    //         Category: {
    //           name: category,

    //         },
    //       },
    //     },
    //   },
    //   include: {
    //     Author: true,
    //     Comments: true,
    //     Likes: true,
    //     Dislikes: true,
    //     PostCategories: {
    //       include: {
    //         Category: true,
    //       },
    //     },
    //   },
    // });

    const posts = await prisma.post.findMany({
      include: {
        PostCategories: {
          include: {
            Category: true,
          },
        },
      },
    });

    const filteredPosts = posts?.filter((post) =>
      post.PostCategories?.some(
        (pc) => pc.Category.name?.toLowerCase() === category?.toLowerCase()
      )
    );
    return sendResponse(res, {
      success: true,
      data: filteredPosts,
      message: "All post fetched successfully",
    });
  } catch (error) {
    return sendResponse(res, {
      success: false,
      message: "Something went wrong",
    });
  }
}
