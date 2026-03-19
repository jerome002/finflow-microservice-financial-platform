import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter = null;

const getTransporter = () => {
  if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // FIX: Explicitly use Port 465 with SSL for production reliability on Render
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, 
      secure: true, // Use true for Port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Must be the 16-character App Password
      },
      // Senior Move: Set explicit timeouts to prevent service hangs
      connectionTimeout: 15000, // 15 seconds
      greetingTimeout: 15000,
      socketTimeout: 20000
    });

    // Verify connection on startup to catch errors in logs immediately
    transporter.verify((error) => {
      if (error) {
        console.error("SMTP Connection Error:", error.message);
      } else {
        console.log("Email Server Ready (Port 465)");
      }
    });
  }
  return transporter;
};

export const sendVerificationEmail = async (email, token) => {
  const emailTransporter = getTransporter();
  if (!emailTransporter) {
    console.warn("Email service not configured. Check EMAIL_USER and EMAIL_PASS.");
    return;
  }
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: `"FinFlow Support" <${process.env.EMAIL_USER}>`, // Added a professional Display Name
      to: email,
      subject: "Verify Your FinFlow Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #10b981;">Welcome to FinFlow!</h2>
          <p>Please click the button below to verify your email address and activate your account.</p>
          <a href="${verificationUrl}" 
             style="background-color: #10b981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
             Verify Email
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">If you did not create an account, you can safely ignore this email.</p>
        </div>
      `
    };
    
    const info = await emailTransporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
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
      from: `"FinFlow Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your FinFlow Password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #ef4444;">Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetUrl}" 
             style="background-color: #3b82f6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
             Reset Password
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">This link will expire soon. If you didn't request this, please secure your account.</p>
        </div>
      `
    };
    await emailTransporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
  } catch (err) {
    console.error("Failed to send reset email:", err.message);
  }
};