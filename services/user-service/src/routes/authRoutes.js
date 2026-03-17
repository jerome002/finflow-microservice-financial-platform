import express from "express";
import { register, login, verifyEmail, forgotPassword, resetPasswordHandler } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordHandler);

export default router;