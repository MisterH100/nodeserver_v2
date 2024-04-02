import connectToRedis from "../db/connectToRedis.js";
import Product from "../models/product.model.js";

export const newProduct = async (req, res) => {
  const new_product = req.body;
  try {
    const newProduct = new Product({
      name: new_product.name,
      brand: new_product.brand,
      description: new_product.description,
      price: new_product.price,
      refurbished_price: new_product.refurbished_price,
      in_stock: new_product.in_stock,
      category: new_product.category,
      tags: new_product.tags,
      images: new_product.images,
      createdAt: Date.now(),
    });
    const product = await newProduct.save();
    res.status(200).json({ message: "product created", product: product.name });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to create product, internal server error" });
  }
};

export const newProductList = async (req, res) => {
  const productList = req.body.productList;
  try {
    productList.map((prod) => {
      const newProduct = new Product({
        name: prod.name,
        brand: prod.brand,
        description: prod.description,
        price: prod.price,
        refurbished_price: prod.refurbished_price,
        in_stock: prod.in_stock,
        category: prod.category,
        tags: prod.tags,
        images: prod.images,
        createdAt: Date.now(),
      });
      newProduct.save();
    });
    res
      .status(200)
      .json({ message: "products created", products: productList.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to create products, internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const redis = await connectToRedis();
    const allProducts = await redis.get("allProducts");

    if (allProducts) {
      res.status(200).send(JSON.parse(allProducts));
    } else {
      Product.find()
        .sort({ createdAt: "descending" })
        .then((product) => {
          res.send(product);
          redis.set("allProducts", JSON.stringify(product), { EX: 120 });
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to get all products, internal server error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const redis = await connectToRedis();
    const cat_products = await redis.get(category);

    if (cat_products) {
      res.status(200).send(JSON.parse(cat_products));
    } else {
      Product.find({ category: category })
        .sort({ createdAt: "descending" })
        .then((product) => {
          res.send(product);
          redis.set(category, JSON.stringify(product), { EX: 120 });
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "failed to get products by category, internal server error",
      });
  }
};

export const getProductsByTags = async (req, res) => {
  const tagsArr = req.body.tags_array;
  try {
    Product.find({ tags: { $in: tagsArr } })
      .sort({ createdAt: "descending" })
      .then((product) => {
        res.send(product);
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "failed to get products by tags, internal server error",
      });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const redis = await connectToRedis();
    const product = await redis.get(productId);

    if (product) {
      res.status(200).send(JSON.parse(product));
    } else {
      Product.findById(productId).then((product) => {
        res.send(product);
        redis.set(productId, JSON.stringify(product), { EX: 120 });
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to get product by id, internal server error" });
  }
};

export const searchProducts = async (req, res) => {
  const query = req.params.query;
  try {
    const redis = await connectToRedis();
    const search_results = await redis.get(query);

    if (search_results) {
      res.status(200).send(JSON.parse(search_results));
    } else {
      Product.find({ $text: { $search: query } })
        .sort({ createdAt: "descending" })
        .then((searchedProducts) => {
          res.send(searchedProducts);
          redis.set(query, JSON.stringify(searchedProducts), { EX: 60 });
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({
        message: "failed to search products by query , internal server error",
      });
  }
};
