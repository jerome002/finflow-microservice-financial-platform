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

export const sendTransactionNotification = async (email, type, amount) => {
  const emailTransporter = getTransporter();
  if (!emailTransporter) {
    console.warn("Email service not configured. Skipping transaction notification.");
    return;
  }
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `FinFlow Transaction Notification`,
      html: `<p>Your account has been ${type.toLowerCase()}ed by $${amount}.</p>`
    };
    await emailTransporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send transaction notification:", err.message);
  }
};