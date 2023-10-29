const router = require("express").Router();
const User = require("../models/users.cjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateFromEmail, generateUsername } = require("unique-username-generator");
const ROUNDS = 10;
const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage")
const url = process.env.MONGO_STRING
const MongoClient = require("mongodb").MongoClient
const GridFSBucket = require("mongodb").GridFSBucket
const mongoClient = new MongoClient(url)

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
    const emailLogin = req.body.email;
    const passwordLogIn = req.body.password;
    const regex = /\S+@\S+\.\S+/;

    if(!regex.test(emailLogin)){
        try {
            await User.findOne({username: emailLogin})
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
        }catch(error) {
            res.send(error)
        }
    }
    if(regex.test(emailLogin)){
        try {
            await User.findOne({email: emailLogin})
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
        }catch(error) {
            res.send(error)
        }
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
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) =>{
                if(error){
                    res.json({authenticated: false,error});
                }
                if(decoded){
                    const userId = decoded.tokenId;
                    res.locals.id = userId;
                    next()
                }
            });
        } catch(error) {
            res.json({authenticated: false,error})
        }
    }

}

router.post("/auth", verifyAuth, async(req,res) =>{
    const id = res.locals.id;
    try {  
        await User.findById(id).then(user =>{
            if(!user){
                res.json({authenticated: false})
            }
            if(user){
                const {password, ...details} = user._doc;
                res.json({authenticated: true, user:details});
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

//get users
router.get("/users", async(req,res) =>{
    try {
        await User.find().sort({createdAt: "descending"})
        .then((users) => {
            res.json(users.map(user=> {
                const {password, ...details} = user._doc;
                return details
            } ));
        });
    }
    catch (error) {
        res.send(error);
    }
})

//update username
router.put("/user/update-user/:id", async(req,res) =>{
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

//change password
router.put("/user/update-pass/:id", async(req,res) =>{
    const userId = req.params.id;
    const newPassword = req.body.password;
    const email = req.body.email;
    try {
        await User.findById(userId)
        .then(user =>{
            if(!user){
                res.json("failed to change password")
            }

            if(user.email == email){
                try {
                    const salt = bcrypt.genSaltSync(ROUNDS);
                    const hashedPassword = bcrypt.hashSync(newPassword, salt);
                    User.updateOne({_id:userId}, {$set:{password: hashedPassword}})
                    .then(()=>{
                        res.json("password changed")
                    })
                } catch (error) {
                    res.json(error)
                }
            }
            res.json("failed to change password")
        })
    } catch (error) {
        res.json(error)
    }
})

//upload image
const storage = new GridFsStorage({
    url,file: (req, file) => {
      if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        return {
          bucketName: "user_profile_images",
          filename: `${file.fieldname}_${file.originalname}`,
        }
      } else {
        return `${file.fieldname}_${file.originalname}`
      }
    },
})
const upload = multer({ storage })
  
router.put('/profile/:id', upload.single('profileImage'), async (req, res) => {
    const id = req.params.id
    const file = req.file;
    const imageUrl = req.protocol + '://' + req.get('host');

    try {
        await User.findByIdAndUpdate(id,{
            $set:{profileImage:{
                data: file.filename,
                image_url: imageUrl + '/api/profile/user_profile_images/' + file.fieldname + "_" + file.originalname,
                contentType: file.contentType
            }}
        }).then(()=>{
            res.json("profile image updated")
        })
    } catch (error) {
        res.json(error)
    }
});

//get image
router.get("/profile/user_profile_images/:filename", async(req,res) =>{
    const filename = req.params.filename;
    try {
        await mongoClient.connect()
        const database = mongoClient.db("test")
        const imageBucket = new GridFSBucket(database, {
            bucketName: "user_profile_images",
        })

        let downloadStream = imageBucket.openDownloadStreamByName(
            filename
        )
        downloadStream.on("data", (data) => {
            return res.status(200).write(data)
        })

        downloadStream.on("error",(data) => {
            return res.status(404).send({ error: "Image not found" })
        })

        downloadStream.on("end", () => {
            return res.end()
        })
        } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error Something went wrong",
            error,
        })
    }
    
});

module.exports = router;

