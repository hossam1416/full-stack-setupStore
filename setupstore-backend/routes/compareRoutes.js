import express from "express";
import { compareProducts } from "../controllers/compareController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, compareProducts);

export default router;
