import express from "express";
import {
  getAllOrders,
  getOrdersByCustomerId,
  getOrdersByEmail,
  newOrder,
  getOrderByNumber,
  updateOrderStatus,
} from "../controllers/product_order.controller.js";

const router = express.Router();

router.post("/products/orders/new", newOrder);

router.get("/products/orders/all", getAllOrders);

router.get("/products/orders/number/:order_number", getOrderByNumber);

router.get("/products/orders/email/:email", getOrdersByEmail);

router.get("/products/orders/id/:id", getOrdersByCustomerId);

router.post("/products/orders/status/:order_number", updateOrderStatus);

export default router;
