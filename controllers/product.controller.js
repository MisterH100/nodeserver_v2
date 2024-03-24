import Product from "../models/product.model.js";

export const newProduct = async (req, res) => {
  const new_product = req.body;
  try {
    const newProduct = new Product({
      name: new_product.name,
      brand: new_product.brand,
      description: new_product.description,
      price: new_product.price,
      in_stock: new_product.in_stock,
      categories: new_product.categories,
      images: new_product.images,
      createdAt: Date.now(),
    });
    const product = await newProduct.save();
    res.send(product.name + " sent");
  } catch (error) {
    res.send(error);
  }
};

export const newProducts = async (req, res) => {
  const productList = ProductArray;
  try {
    productList.map((prod) => {
      const newProduct = new Product({
        name: prod.name,
        brand: prod.brand,
        description: prod.description,
        price: prod.price,
        in_stock: prod.in_stock,
        categories: prod.categories,
        images: prod.images,
        createdAt: Date.now(),
      });
      newProduct.save();
    });
    res.send("sent");
  } catch (error) {
    res.send(error);
  }
};

export const getProducts = async (req, res) => {
  try {
    Product.find().then((product) => {
      res.send(product);
    });
  } catch (error) {
    res.send(error);
  }
};

export const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    Product.findById(productId).then((product) => {
      res.send(product);
    });
  } catch (error) {
    res.send(error);
  }
};

export const searchProducts = async (req, res) => {
  const query = req.params.query;
  try {
    Product.find({ $text: { $search: query } }).then((searchedProducts) => {
      res.send(searchedProducts);
    });
  } catch (err) {
    res.send(err);
  }
};
