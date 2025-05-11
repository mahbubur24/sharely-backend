import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import apiError from "../error/apiError";
import apiResponse from "../error/apiResponse";
import asyncHandler from "../error/asyncHandler";
import { prisma } from "../prisma-client/prisma"; // methode
import { generateResetPasswordToken } from "../utils/generateResetToken";
import { sendEmail } from "../utils/sendEmail";
import { sendToken } from "../utils/sendToken";
import { User } from "@prisma/client";


export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    // Validate required fields
    if (!name || !email || !password) {
      throw new apiError(400, "Please provide all fields");
    }

    // Check if user data already exists and is account verified
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: {
        accountVerified: true,
      },
    });

    if (existingUser) {
      throw new apiError(400, "User already exists and is verified");
    }

    const registrationAttemptByUser = await prisma.user.findUnique({
      where: { email },
      select: {
        accountVerified: true,
      },
    });

    if (registrationAttemptByUser) {
      throw new apiError(
        400,
        "You have exceeded the maximum number of registration attempts. Please try after 1hr."
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Create a new user if not found or not verified
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          Profile: {
            create: {
              bio: "Hello, I am new here!",
            },
          },
        },
      });

      const verificationCode = await generateVerificationCode(user);

      const userData = await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationCode,
          verificationCodeExpires: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      // Send verification code without sending a response here
      await sendVerificationCode(verificationCode, email, user);

      // Send success response after sending email
      const response = new apiResponse(
        201,
        userData,
        "User created successfully"
      );
      res.status(response.statusCode).json({
        success: response.success,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      console.log(error);
      throw new apiError(400, "Something went wrong. Please try again later.");
    }
  }
);

// Function to generate a random 5-digit verification code
function generateVerificationCode(user: User): number {
  function generateRandomFiveDigitCode(): number {
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return parseInt(firstDigit + remainingDigits, 10);
  }

  return generateRandomFiveDigitCode();
}

// Send verification code email (simplified version)
async function sendVerificationCode(
  verificationCode: number,
  email: string,
  user: User
): Promise<void> {
  try {
    const message = generateEmailTemplate(verificationCode);

    // Send the email using your email service
    await sendEmail(email, "Your Verification Code", message);

    // No response is sent here, just handling the email sending logic
  } catch (error) {
    throw new apiError(
      500,
      "Error sending verification code. Please try again later."
    );
  }
}

function generateEmailTemplate(verificationCode: number) {
  return `
  <html>
  <body>
    <h1>Verification Code</h1>
    <p>Your verification code is: ${verificationCode}</p>
  </body>
  </html>
  `;
}

export const verifyOTP = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    const userAllEntries = await prisma.user.findMany({
      where: {
        email,
        accountVerified: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!userAllEntries || userAllEntries.length === 0) {
      throw new apiError(400, "No registration attempts found for this email.");
    }

    let user = userAllEntries[0];

    // Clean up extra unverified users
    if (userAllEntries.length > 1) {
      await prisma.user.deleteMany({
        where: {
          NOT: {
            id: user.id,
          },
          accountVerified: false,
        },
      });
    }

    if (user.verificationCode !== Number(otp)) {
      throw new apiError(400, "Invalid verification code.");
    }

    const currentTime = new Date();
    const verificationExpiry = user.verificationCodeExpires;

    if (!verificationExpiry || currentTime > verificationExpiry) {
      throw new apiError(400, "Verification code has expired.");
    }

    // Update user as verified
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        accountVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    sendToken(updatedUser, 200, "Account Verified", res);
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "Please provide all fields");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new apiError(401, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new apiError(401, "Invalid credentials");
  }

  if (!user.accountVerified) {
    throw new apiError(
      403,
      "Account not verified. Please verify your account."
    );
  }

  await sendToken(user, 200, "User logged in successfully", res);
});

export const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("logout clicked");

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    const response = new apiResponse(200, null, "Successfully logged out");

    res.status(response.statusCode).json({
      success: response.success,
      message: response.message,
      data: response.data,
    });
  }
);

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = res.locals.user;

  if (!user) {
    throw new apiError(401, "User not found");
  }

  const response = new apiResponse(200, user, "User fetched successfully");

  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.body.email;

    const user = await prisma.user.findUnique({
      where: { email: req.body.email, accountVerified: true },
    });

    if (!user) {
      throw new apiError(400, "User not found");
    }

    const { resetToken, hashedToken, expiry } = generateResetPasswordToken();

    console.log("Token :", resetToken);
    // Update user with hashed token and expiry
    await prisma.user.update({
      where: { email: req.body.email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordTokenExpires: expiry,
      },
    });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetPasswordUrl} \n\n If you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
      await sendEmail(email, "Password Reset Token", message);

      const response = new apiResponse(
        200,
        {
          user,
          resetToken,
        },
        "Reset password token sent to your email."
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      // Cleanup on failure
      await prisma.user.update({
        where: { email },
        data: {
          resetPasswordToken: null,
          resetPasswordTokenExpires: null,
        },
      });

      throw new apiError(500, "Error sending email. Please try again later.");
    }
  }
);

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  const hashedToken = crypto.createHash("sha512").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new apiError(400, "Invalid or expired reset token.");
  }

  if (req.body.password !== req.body.confirmPassword) {
    throw new apiError(400, "Passwords do not match.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update user's password and clear reset token fields
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordTokenExpires: null,
    },
  });
  sendToken(updatedUser, 200, "Password reset successful", res);
});

export const getUserData = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body;

  if (!id) {
    throw new apiError(401, "User not found");
  }

  const userData = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      Profile: true,
      Posts: {
        include: {
          PostCategories: {
            include: {
              Category: true, // Get category name etc.
            },
          },
        },
      },
      Comments: {
        include: {
          Post: true, // Optional: to see which post comment belongs to
        },
      },
      Likes: {
        include: {
          Post: true, // Optional: to get liked post details
        },
      },
    },
  });

  const response = new apiResponse(200, userData, "User fetched successfully");

  res.status(response.statusCode).json({
    success: response.success,
    message: response.message,
    data: response.data,
  });
});
