const router = require("express").Router();
const Products = require("../models/products.cjs");
const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage")
const url = process.env.MONGO_STRING
const MongoClient = require("mongodb").MongoClient
const GridFSBucket = require("mongodb").GridFSBucket
const mongoClient = new MongoClient(url)


const storage = new GridFsStorage({
  url,file: (req, file) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      return {
        bucketName: "product_images",
        filename: `${file.fieldname}_${file.originalname}`,
      }
    } else {
      return `${file.fieldname}_${file.originalname}`
    }
  },
})
const upload = multer({ storage })


//post product with single image
router.post('/product', upload.array('productImages',5), async (req, res) => {
    const files = req.files;
    const imageUrl = req.protocol + '://' + req.get('host');
    const productImages = [
      {
        data: files[0].filename,
        image_url: imageUrl + '/api/products/product_images/' + files[0].fieldname + "_" + files[0].originalname,
        contentType: files[0].contentType
      },
      {
        data: files[1].filename,
        image_url: imageUrl + '/api/products/product_images/' + files[1].fieldname + "_" + files[1].originalname,
        contentType: files[1].contentType
      },
      {
        data: files[2].filename,
        image_url: imageUrl + '/api/products/product_images/' + files[2].fieldname + "_" + files[2].originalname,
        contentType: files[2].contentType
      }
    ]
    try {
        const newProduct = new Products({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            stock_quantity: req.body.stock_quantity,
            categories: req.body.categories,
            reviews: req.body.review,
            product_images:productImages,
            createdAt: Date.now()
        })
        const product = await newProduct.save();
        res.send(product.name + " sent")
    } catch (error) {
        res.send(error)
    }
    
});


//get products
router.get('/products', (req, res) => {
    try {
        Products.find()
        .then((product) =>{
            res.send(product)
            
        })
    } catch (error) {
        res.send(error)
    }

});

//get one product

router.get("/products/product/:id", (req, res) => {
    const productId = req.params.id;
    try {
        Products.findById(productId)
        .then((product) => {
            res.send(product);
        });
    }
    catch (error) {
        res.send(error);
    }
})

//search product
router.get("/products/search/:query", (req,res) =>{
  const query = req.params.query;
  try{
      Products.find({$text:{$search:query}},{score:{$meta:"searchScore"}})
      .then((searchedProducts) =>{
          res.send(searchedProducts)
      });
  }
  catch (err) {
      res.send(err);
  }
})

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
    
});

module.exports = router;