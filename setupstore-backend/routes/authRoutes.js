import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.put("/profile", authMiddleware.protect, authController.updateProfile);
router.put("/password", authMiddleware.protect, authController.updatePassword);
router.get("/me", authMiddleware.protect, authController.getMe);

export default router;
