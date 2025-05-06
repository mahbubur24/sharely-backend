import nodemailer from "nodemailer";

import apiError from "../error/apiError";

export const sendEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: process.env.SMTP_SERVICE,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error("Error sending email: ", error.message);
    throw new apiError(201, "Failed to send email.");
  }
};
