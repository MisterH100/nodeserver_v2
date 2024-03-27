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
    Product.find().then((product) => {
      res.send(product);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to get products, internal server error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    Product.find({ category: category }).then((product) => {
      res.send(product);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to get products, internal server error" });
  }
};

export const getProductsByTags = async (req, res) => {
  const tagsArr = req.body.tags_array;
  try {
    Product.find({ tags: { $in: tagsArr } }).then((product) => {
      res.send(product);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to get products, internal server error" });
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    Product.findById(productId).then((product) => {
      res.send(product);
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to get product, internal server error" });
  }
};

export const searchProducts = async (req, res) => {
  const query = req.params.query;
  try {
    Product.find({ $text: { $search: query } }).then((searchedProducts) => {
      res.send(searchedProducts);
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "failed to search products, internal server error" });
  }
};
