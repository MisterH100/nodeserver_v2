import express from "express";
import {
  getGraphData,
  getOrders,
  getStats,
} from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/externalwear/stats", getStats);
router.get("/externalwear/stats/orders", getOrders);
router.get("/externalwear/stats/graph", getGraphData);

export default router;
