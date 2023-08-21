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

//get Emails
router.get("/getEmails", (req, res) => {
    try {
        Email.find().then((emails) => {
            res.send(emails);
        });
    }
    catch (err) {
        res.send(err);
    }

})

//get one Email

router.get("/getEmails/:id", (req, res) => {
    const emailId = req.params.id;
    try {
        Email.findById(emailId).then((email) => {
            res.send(email);
        });
    }
    catch (err) {
        res.send(err);
    }
})


//delete one email 
router.delete('/getEmails/:id', function (req, res) {
    const emailId = req.params.id;
    try {
        Email.findByIdAndRemove(emailId).then((email) => {
            res.send(email.name + " deleted");
        });
    }
    catch (err) {
        res.sendDate(err);
    }
})

module.exports = router;