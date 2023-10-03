const router = require("express").Router();
const Products = require("../models/products.cjs");
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/product_images')
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname)
    }
});
 
const upload = multer({ storage: storage });


//post products
router.post('/product', upload.single('productImage'), async (req, res) => {
    const file = req.file;
    const url = req.protocol + '://' + req.get('host');
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
            productImages: {
                image: {
                    data: fs.readFileSync(path.join(__dirname +'public/product_images/' + file.originalname)),
                    image_url: url + '/product_images/'+ file.originalname,
                    contentType: file.contentType
                },
            },
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