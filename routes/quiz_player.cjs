const router = require("express").Router();
const Player = require("../models/quiz_player.cjs");
const jwt = require('jsonwebtoken');

//Submit
router.post("/quiz_player/new", async (req, res) => {
    const {username} = req.body
    try {
        const newPlayer = new Player({
            username: username
        });
        const player = await newPlayer.save();
        res.send(player);
    }
    catch (err) {
        res.send(err);
    }
})

router.get("/quiz_player/player/:username",(req,res)=>{
    const username = req.params.username
    try{
        Player.findOne({"username":username})
        .then((player)=>{
            if(!player){
                res.json({username:null})
            }
            if(player){
                const tokenId = player._id;
                const token = jwt.sign({ tokenId}, process.env.JWT_SECRET);
                res.json({player_id:player._id,token:token})
            }
        })
    }
    catch (err) {
        res.send(err);
    }
})

router.get("/quiz_player/players/all", (req, res) => {
    try {
        Player.find().sort({createdAt: "descending"})
        .then((players) => {       
            res.send(players);
        });
    }
    catch (err) {
        res.send(err);
    }

})

router.get("/quiz_player/time_stamp/:id",(req,res)=>{
    const playerId = req.params.id 
    try{
        Player.findById(playerId)
        .then((player)=>{
            if(player){
                res.json({timeStamp:player.timeStamp})
            }
            if(!player){
                res.json({timeStamp:null})
            }
        })
       
    }catch (error) {
        res.json(error)
    }
})

router.put('/quiz_player/update/:id', (req, res)=>{
    const playerId = req.params.id;
    const {points,correctQuizIds,incorrectQuizIds} = req.body
    try {
        Player.updateOne({"_id": playerId},
            {
                $inc:{'points':points},
                $push:{'correctQuizzes':{$each:correctQuizIds},'incorrectQuizzes':{$each:incorrectQuizIds}},
                $set:{'timeStamp':Date.now()}
            },
        )
        .then((player)=>{
            res.json({...player,success:true})
        })
    } catch (error) {
        res.json(error)
    }
    
})

router.put('/quiz_player/completed/:id',async(req,res)=>{
    const playerId = req.params.id;
    try{
        await Player.findOne({"_id":playerId}).then((player)=>{
            if(player.completed){
                Player.updateOne({"_id":playerId},
                {
                    $set:{'completed':false}
                }).then((player)=>{
                    res.json({...player,success:true})
                })
            }
            if(!player.completed){
                Player.updateOne({"_id":playerId},
                {
                    $set:{'completed':true}
                }).then((player)=>{
                    res.json({...player,success:true})
                })
            }
        })
    } catch (error) {
        res.json(error)
    }
})

module.exports = router;