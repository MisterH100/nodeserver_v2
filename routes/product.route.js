import express from "express";
import {
  getProductById,
  getAllProducts,
  getProductsByCategory,
  newProduct,
  newProductList,
  searchProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/products/new", newProduct);

router.post("/products/new/list", newProductList);

router.get("/products/all", getAllProducts);

router.get("/products/:id", getProductById);

router.get("/products/category/:category", getProductsByCategory);

router.get("/products/search/:query", searchProducts);

export default router;
