const router = require("express").Router();

router.get("",(req, res) => {
    try {
        res.send("Hello world")
    }
    catch (err) {
        res.send(err);
    }

})
module.exports = router;