const router = require("express").Router();
const Email = require("../models/emails.cjs");

//Submit

router.post("/emails/new", async (req, res) => {
    try {
        const newEmail = new Email({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message,
            sentAt: new Date()
        });
        const email = await newEmail.save();
        res.send(email);
    }
    catch (err) {
        res.send(err);
    }
})

//get Emails
router.get("/emails", (req, res) => {
    try {
        Email.find().sort({sentAt: "descending"})
        .then((emails) => {
            res.send(emails);
        });
    }
    catch (err) {
        res.send(err);
    }

})

//get one Email

router.get("/emails/email/:id", (req, res) => {
    const emailId = req.params.id;
    try {
        Email.findById(emailId)
        .then((email) => {
            res.send(email);
        });
    }
    catch (err) {
        res.send(err);
    }
})

//patch email

router.patch('/emails/update/:id', (req, res)=>{
    const emailId = req.params.id;
    try {
        Email.findByIdAndUpdate(emailId)
        .then((email)=>{
            res.send(email);
        })
    } catch (error) {
        res.send(error)
    }
})

//delete one email 
router.delete('/emails/delete/:id', (req, res)=> {
    const emailId = req.params.id;
    try {
        Email.findByIdAndRemove(emailId)
        .then((email) => {
            res.send(email.name + " deleted");
        });
    }
    catch (err) {
        res.send(err);
    }
})

module.exports = router;