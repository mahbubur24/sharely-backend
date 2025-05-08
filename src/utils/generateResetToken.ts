import crypto from "crypto";

export function generateResetPasswordToken(): {
  resetToken: string;
  hashedToken: string;
  expiry: Date;
} {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha512")
    .update(resetToken)
    .digest("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  return { resetToken, hashedToken, expiry };
}
