const router = require("express").Router();
const Products = require("../models/products.cjs");
const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage")
const url  = process.env.MONGO_STRING;


const storage = new GridFsStorage({
    url,file: (req, file) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        return {
          bucketName: "product_images",
          filename: `${Date.now()}_${file.originalname}`,
        }
      } else {

        return `${Date.now()}_${file.originalname}`
      }
    },
})


 

const upload = multer({ storage});

//post products
router.post('/product', upload.single('productImage'), async (req, res) => {
    const file = req.file;
    try {
        const newProduct = new Products({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
            gender: req.body.gender,
            sizes: {
                clothing: req.body.clothingSizes, 
                shoes: req.body.shoeSizes
            },
            productImages: [
                {
                    image_one: file.filename,
                    contentType: file.contentType
                },
                {
                    image_two: file.filename,
                    contentType: file.contentType
                },
                {
                    image_three: file.filename,
                    contentType: file.contentType
                },
            ],
            createdAt: Date.now()
        })
        const product = await newProduct.save();
        res.send(product.name + " product sent")

    } catch (error) {
        res.send(error)
    }
    
});


//get products
router.get('/products', (req, res) => {
    try {
        Products.find({})
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

module.exports = router;