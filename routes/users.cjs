const router = require("express").Router();
const User = require("../models/users.cjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateFromEmail, generateUsername } = require("unique-username-generator");
const ROUNDS = 10;

//register
router.post("/register", async (req, res) => {
    const newName = req.body.name;
    const newSurname = req.body.surname
    const newEmail =  req.body.email;
    const newPassword = req.body.password;
    const newUsername = generateFromEmail(newEmail);

    try{
        await User.findOne({email: newEmail})
        .then((user) =>{

            if(!user){
                const salt = bcrypt.genSaltSync(ROUNDS);
                const hashedPassword = bcrypt.hashSync(newPassword, salt);
                const newUser = new User({
                    name: newName,
                    surname: newSurname,
                    username: newUsername,
                    email: newEmail ,
                    password: hashedPassword,
                    createdAt: new Date()
                });
                const user = newUser.save();
                res.status(200).json("user registered succesfully")  
                
                
            }
            if(user){
                res.status(404).json("this email is taken")
            }
        })
        
    }
    catch (err) {
        res.send(err);
    }
})


//login
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
                const tokenId = user._id;

                if(!validatePassword){
                    res.status(404).json("wrong credentials");;
                }
                if(validatePassword){
                    const {password, ...details} = user._doc;
                    const token = jwt.sign({ tokenId}, process.env.JWT_SECRET,{ expiresIn: '1d' });
                    res.status(200).json({user:details,token:token});
                }
            }
        })
    } catch (error) {
        res.send(error)
    }
})


//auth
const verifyAuth = (req,res,next) =>{
    const token = req.headers["auth-token"];
    
    if(!token){
        res.json({authenticated: false})
    }
    if(token){
        try {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
                if(err){
                    res.json({authenticated: false,err});
                }
                if(decoded){
                    next()
                }
            });
        } catch(err) {
            res.json({authenticated: false,err})
        }
    }

}

router.post("/auth", verifyAuth, async(req,res) =>{
    const AuthUser = req.body.user;
    try {  
        await User.findOne({username: AuthUser.username}).then(user =>{
            if(!user){
                res.json({authenticated: false, user: AuthUser})
            }
            if(user){
                res.json({authenticated: true})
            }
        })
    } catch (error) {
        res.json(error)
    }
})

//get user
router.get("/user/:id", async(req,res) =>{
    const userId = req.params.id;

    try {
        await User.findById(userId)
        .then(user=>{
            res.send(user)
        })
    } catch (error) {
        res.json(error)
    }
})

//update username
router.put("/user/update/:id", async(req,res) =>{
    const userId = req.params.id;
    const newUsername = req.body.username;
    try {    
        await User.findOne({username: newUsername})
        .then(user =>{
            if(!user){ 
                try {
                    User.updateOne({"_id": userId}, {$set:{"username": newUsername}})
                    .then(()=>{
                        res.json("username updated")
                    })
                } catch (error) {
                    res.json(error)
                }
            }
            if(user){
                res.json("this username is taken")
            }
        })
    } catch (error) {
        res.json(error)
    }
})

module.exports = router;

