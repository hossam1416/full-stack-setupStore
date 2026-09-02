import express from "express";

import orderController from "../controllers/orderController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware.protect, orderController.createOrder);

router.get("/", authMiddleware.protect, orderController.getOrders);

router.get(
  "/admin/all",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  orderController.getAllOrders,
);
router.put(
  "/:id/status",
  authMiddleware.protect,
  authMiddleware.adminOnly,
  orderController.updateOrderStatus,
);
router.get("/:id", authMiddleware.protect, orderController.getOrderById);

export default router;
