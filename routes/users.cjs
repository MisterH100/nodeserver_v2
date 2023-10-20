const router = require("express").Router();
const User = require("../models/users.cjs");
const bcrypt = require('bcrypt');
const ROUNDS = 10;


router.post("/register", async (req, res) => {

    try{
        const newUsername = req.body.username;
        const newEmail =  req.body.email;
        const newPassword = req.body.password;

        await User.findOne({username: newUsername})
        .then((user) =>{

            if(!user){
                const salt = bcrypt.genSaltSync(ROUNDS);
                const hashedPassword = bcrypt.hashSync(newPassword, salt);
                const newUser = new User({
                    username: newUsername,
                    email: newEmail ,
                    password: hashedPassword,
                    createdAt: new Date()
                });
                const user = newUser.save();
                res.status(200).json('user created')  
                
                
            }
            if(user){
                res.status(404).json("username is taken")
            }
        })
        
    }
    catch (err) {
        res.send(err);
    }
})

router.post("/login", async(req,res) =>{
    const usernameLogIn = req.body.username;
    const passwordLogIn = req.body.password;
    try {
       await User.findOne({username: usernameLogIn})
       .then(user =>{
        if(!user){
            res.status(404).json("user does not exist");
        }

        if(user){
            const validatePassword = bcrypt.compareSync(passwordLogIn, user.password);
            
            if(!validatePassword){
                res.status(404).json("wrong credentials");;
            }
            if(validatePassword){
                const {password, ...details} = user._doc;
                res.status(200).json(details);
            }
        }
       })
    } catch (error) {
        res.send(error)
    }
})

module.exports = router;
