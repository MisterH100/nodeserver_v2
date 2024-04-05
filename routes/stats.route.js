import express from "express";
import { getOrders, getStats } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/externalwear/stats", getStats);
router.get("/externalwear/stats/orders", getOrders);

export default router;
