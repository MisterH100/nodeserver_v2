const router = require("express").Router();
const Products = require("../models/products.cjs");
const ProductArray = require("../products.json");
//upload product
router.post("/product", async (req, res) => {
  const new_product = req.body;
  try {
    const newProduct = new Products({
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
});

//upload array of products
router.post("/product/list", async (req, res) => {
  const productList = ProductArray;
  try {
    productList.map((prod) => {
      const newProduct = new Products({
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
});

//get products
router.get("/products", (req, res) => {
  try {
    Products.find().then((product) => {
      res.send(product);
    });
  } catch (error) {
    res.send(error);
  }
});

//get one product
router.get("/products/product/:id", (req, res) => {
  const productId = req.params.id;
  try {
    Products.findById(productId).then((product) => {
      res.send(product);
    });
  } catch (error) {
    res.send(error);
  }
});

//search product
router.get("/products/search/:query", (req, res) => {
  const query = req.params.query;
  try {
    Products.find(
      { $text: { $search: query } },
      { score: { $meta: "searchScore" } }
    ).then((searchedProducts) => {
      res.send(searchedProducts);
    });
  } catch (err) {
    res.send(err);
  }
});

/*
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const url = process.env.MONGO_STRING;
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const mongoClient = new MongoClient(url);


const storage = new GridFsStorage({
  url,
  file: (req, file) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "product_images",
        filename: `${file.fieldname}_${file.originalname}`,
      };
    } else {
      return `${file.fieldname}_${file.originalname}`;
    }
  },
});
const upload = multer({ storage });

//get image
router.get("/products/product_images/:filename", async(req,res) =>{
  const filename = req.params.filename;
  try {
    await mongoClient.connect()
    const database = mongoClient.db("test")
        const imageBucket = new GridFSBucket(database, {
          bucketName: "product_images",
        })
    
        let downloadStream = imageBucket.openDownloadStreamByName(
          filename
          )
        downloadStream.on("data", (data) => {
          return res.status(200).write(data)
        })
        
        downloadStream.on("error",(data) => {
          return res.status(404).send({ error: "Image not found" })
        })
    
        downloadStream.on("end", () => {
          return res.end()
        })
      } catch (error) {
        console.log(error)
        res.status(500).send({
          message: "Error Something went wrong",
          error,
        })
      }
    
    });*/

module.exports = router;
