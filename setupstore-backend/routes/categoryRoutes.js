import express from "express";
import categoryController from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  categoryController.createCategory,
);
router.put(
  "/:id",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  categoryController.updateCategory,
);
router.delete(
  "/:id",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  categoryController.deleteCategory,
);
export default router;
