import express from "express";

import {
  checkCompatibility,
  createBuild,
  getBuilds,
  deleteBuild,
} from "../controllers/builderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/check-compatibility", protect, checkCompatibility);
router.post("/", protect, createBuild);
router.get("/", protect, getBuilds);
router.delete("/:id", protect, deleteBuild);

export default router;
