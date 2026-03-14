import User from "../models/User.js";

export const createUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const user = await User.create({ name, email, password });
  return user;
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};