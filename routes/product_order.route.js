import express from "express";
import {
  getOrders,
  getOrdersWithEmail,
  newOrder,
  orderProducts,
} from "../controllers/product_order.controller.js";

const router = express.Router();

router.post("/products/orders", newOrder);

router.get("/order_products/:order_number", orderProducts);

router.get("/orders", getOrders);

router.get("/orders/:email", getOrdersWithEmail);

export default router;
