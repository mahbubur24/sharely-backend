import { User } from "@prisma/client";
import { Response } from "express";

const jwt = require("jsonwebtoken");

export const sendToken = async (
  user: User,
  statusCode: number,
  message: string,
  res: Response
): Promise<void> => {
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: String(process.env.JWT_EXPIRES_IN),
    }
  );
  // console.log("JWT secret kry : ", process.env.JWT_SECRET_KEY);
  // console.log("JWT expires in : ", process.env.JWT_EXPIRES_IN);
  // console.log("Token generated:", token);

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() +
          Number(process.env.JWT_COOKIE_EXPIRES) * 60 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
