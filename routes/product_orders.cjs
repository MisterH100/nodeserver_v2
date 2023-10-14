const router = require("express").Router();
const ProductOrder = require("../models/product_orders.cjs");

//Submit

router.post("/products/orders", async (req, res) => {
    try {
        const newProductOrder = new ProductOrder({
            email: req.body.email,
            name: req.body.name,
            lastName: req.body.lastName,
            phone: req.body.phone,
            products: req.body.products
        });
        const order = await newProductOrder.save();
        res.send(order);
    }
    catch (err) {
        res.send(err);
    }
})

module.exports = router;