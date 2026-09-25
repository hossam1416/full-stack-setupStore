import express from "express";
import {
  updateProfile,
  updatePassword,
  getMe,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);
router.get("/me", protect, getMe);

export default router;
