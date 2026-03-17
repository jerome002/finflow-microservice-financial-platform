import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendTransactionNotification = async (email, type, amount) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `FinFlow Transaction Notification`,
    html: `<p>Your account has been ${type.toLowerCase()}ed by $${amount}.</p>`
  };
  await transporter.sendMail(mailOptions);
};