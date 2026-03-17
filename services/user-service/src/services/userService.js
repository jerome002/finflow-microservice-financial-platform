import User from "../models/User.js";
import crypto from "crypto";

export const createUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const user = await User.create({ name, email, password, verificationToken });
  return user;
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByVerificationToken = async (token) => {
  return await User.findOne({ verificationToken: token });
};

export const verifyUserEmail = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) throw new Error("Invalid token");

  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();
  return user;
};

export const createPasswordResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();
  return resetToken;
};

export const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) throw new Error("Invalid or expired token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return user;
};