import express from "express";
import {
  getProductById,
  getAllProducts,
  getProductsByCategory,
  getProductsByTags,
  newProduct,
  newProductList,
  searchProducts,
} from "../controllers/product.controller.js";
import { uploadImagesToCloudinary } from "../middleware/uploadImageToCloudinary.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post(
  "/products/new",
  upload.array("files"),
  uploadImagesToCloudinary,
  newProduct
);

router.post("/products/new/list", newProductList);

router.get("/products/all", getAllProducts);

router.get("/products/id/:id", getProductById);

router.get("/products/category/:category", getProductsByCategory);

router.get("/products/tags", getProductsByTags);

router.get("/products/search/:query", searchProducts);

export default router;
