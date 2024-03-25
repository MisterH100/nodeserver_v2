import express from "express";
import {
  getAllOrders,
  getOrdersByCustomerId,
  getOrdersByEmail,
  newOrder,
  getOrderByNumber,
} from "../controllers/product_order.controller.js";

const router = express.Router();

router.post("/products/orders/new", newOrder);

router.get("/products/orders/all", getAllOrders);

router.get("/products/orders/number/:order_number", getOrderByNumber);

router.get("/products/orders/email/:email", getOrdersByEmail);

router.get("/products/orders/id/:id", getOrdersByCustomerId);

export default router;
