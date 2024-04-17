import express from "express";
import { ikhokhaPayment } from "../controllers/ikhokha.controller.js";

const router = express.Router();

router.post("/ikhokha/pay", ikhokhaPayment);

export default router;
