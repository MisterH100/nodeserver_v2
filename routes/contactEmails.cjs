const router = require("express").Router();
const Email = require("../models/emails.cjs");

//Submit

router.post("/emails", async (req, res) => {
    try {
        const newEmail = new Email({
            name: req.body.name,
            lastName: req.body.lastName,
            email: req.body.email,
            message: req.body.message
        });

        const email = await newEmail.save();
        res.send(email);
    }
    catch (err) {
        res.send(err);
    }
})

router.get("/getEmails", (req, res) => {
    
    Email.find().then((err, emails) => {
        if (!err) {
            res.send(emails);
        }
        else {
            res.send(err);
        }
    })

})

router.get("/getEmails/:id", (req, res) => {
    const emailId = req.params.id;

    Email.findById(emailId).then((err, email) =>{
        if (!err) {
            res.send(email);
        }
        else {
            res.send(err);
        }

      });
})

module.exports = router;