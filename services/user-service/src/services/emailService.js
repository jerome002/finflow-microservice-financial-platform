import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = null;

const getTransporter = () => {
  if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

export const sendVerificationEmail = async (email, token) => {
  const emailTransporter = getTransporter();
  if (!emailTransporter) {
    console.warn("Email service not configured. Skipping verification email.");
    return;
  }
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your FinFlow Account",
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
    };
    await emailTransporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }
};

export const sendPasswordResetEmail = async (email, token) => {
  const emailTransporter = getTransporter();
  if (!emailTransporter) {
    console.warn("Email service not configured. Skipping reset email.");
    return;
  }
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your FinFlow Password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
    };
    await emailTransporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send reset email:", err.message);
  }
};