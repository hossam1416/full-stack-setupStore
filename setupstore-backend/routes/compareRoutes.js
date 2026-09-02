import express from "express";
import compareController from "../controllers/compareController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware.protect, compareController.compareProducts);
export default router;
