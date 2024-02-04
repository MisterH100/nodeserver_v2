const router = require("express").Router();
const Lovers = require("../models/lovers.cjs");

//Submit
router.post("/valentines/new", async (req, res) => {
    try {
        const newLovers = new Lovers({
            girl: req.body.girl,
            boy: req.body.boy,
            sentAt: new Date()
        });
        const lovers = await newLovers.save();
        res.send(lovers);
    }
    catch (err) {
        res.send(err);
    }
})

router.get("/valentines/lovers", (req, res) => {
    try {
        Lovers.find().sort({createdAt: "descending"})
        .then((lovers) => {
            res.send(lovers);
        });
    }
    catch (err) {
        res.send(err);
    }

})

module.exports = router;