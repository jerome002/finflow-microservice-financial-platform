import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createUser, findUserByEmail, verifyUserEmail, createPasswordResetToken, resetPassword } from "../services/userService.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password: hashed });
    await sendVerificationEmail(user.email, user.verificationToken);
    res.status(201).json({ message: "User registered. Please check your email to verify your account.", user: { id: user.id, name, email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await verifyUserEmail(token);
    res.json({ message: "Email verified successfully", user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.emailVerified) return res.status(400).json({ error: "Please verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = await createPasswordResetToken(email);
    await sendPasswordResetEmail(email, resetToken);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPasswordHandler = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);
    const user = await resetPassword(token, hashed);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};