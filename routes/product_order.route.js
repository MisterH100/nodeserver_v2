import express from "express";
import {
  getOrders,
  getOrdersByCustomerId,
  getOrdersByEmail,
  newOrder,
  orderProducts,
} from "../controllers/product_order.controller.js";

const router = express.Router();

router.post("/products/orders", newOrder);

router.get("/order_products/:order_number", orderProducts);

router.get("/orders", getOrders);

router.get("/orders/email/:email", getOrdersByEmail);

router.get("/orders/id/:id", getOrdersByCustomerId);

export default router;
