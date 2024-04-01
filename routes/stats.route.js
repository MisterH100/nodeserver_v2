import express from "express";
import { getStats } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/externalwear/stats", getStats);

export default router;
