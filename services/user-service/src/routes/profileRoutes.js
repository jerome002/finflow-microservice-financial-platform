import express from "express";
import { getProfile } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getProfile);

export default router;