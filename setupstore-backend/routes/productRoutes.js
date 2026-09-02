import express from "express";
import productController from "../controllers/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const { protect, adminOnly } = authMiddleware;
const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:slug", productController.getProductBySlug);
router.post(
  "/",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  productController.createProduct,
);
router.put(
  "/:id",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  productController.updateProduct,
);
router.delete(
  "/:id",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  productController.deleteProduct,
);
router.post(
  "/admin/import",
  protect,
  adminOnly,
  productController.importProducts,
);
export default router;
