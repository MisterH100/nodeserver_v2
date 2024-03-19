import express from "express";
import {
  getProduct,
  getProducts,
  newProduct,
  newProducts,
  searchProducts,
} from "../controllers/product.controller.js";

const router = express.Router();
router.post("/product", newProduct);

router.post("/product/list", newProducts);

router.get("/products", getProducts);

router.get("/products/product/:id", getProduct);

router.get("/products/search/:query", searchProducts);

export default router;
