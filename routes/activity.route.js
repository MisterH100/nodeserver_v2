import express from "express";
import {
  getActivities,
  newActivity,
  stopActivity,
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/activity", newActivity);

router.put("/activity/:id", stopActivity);

router.get("/activities", getActivities);

export default router;
