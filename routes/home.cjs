const router = require("express").Router();

router.get("",(req, res) => {
    try {
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.write('<html><body><h1>Welcome to Handsome`s NodeJs + expressJs server </h1><br></br><p>Visit these links to learn more</p><br></br><ul><li><a href="https://thehandsomedev.com" target="_blank">Handsome`s Portfolio website</a></li></ul></body></html>');
        res.end();
    }
    catch (err) {
        res.send(err);
    }

})
module.exports = router;