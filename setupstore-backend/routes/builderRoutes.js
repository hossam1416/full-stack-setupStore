import express from "express";
import builderController from "../controllers/builderController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/check-compatibility",
  authMiddleware.protect,
  builderController.checkCompatibility,
);
router.post("/", authMiddleware.protect, builderController.createBuild);
router.get("/", authMiddleware.protect, builderController.getBuilds);
router.delete("/:id", authMiddleware.protect, builderController.deleteBuild);
export default router;
