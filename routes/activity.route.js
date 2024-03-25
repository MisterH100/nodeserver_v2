import express from "express";
import {
  getActivities,
  newActivity,
  stopActivity,
} from "../controllers/activity.controller.js";

const router = express.Router();

router.post("/activity/new", newActivity);

router.get("/activities/all", getActivities);

router.put("/activity/id/:id", stopActivity);

export default router;
