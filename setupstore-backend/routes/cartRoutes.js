import express from "express";
import cartController from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware.protect, cartController.addToCart);
router.get("/", authMiddleware.protect, cartController.getCart);
router.put("/", authMiddleware.protect, cartController.updateCartItem);
router.delete("/", authMiddleware.protect, cartController.removeFromCart);
export default router;
