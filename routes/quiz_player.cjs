const router = require("express").Router();
const Player = require("../models/quiz_player.cjs");

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
                res.send(player._id)
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

router.put('/quiz_player/update/:id', (req, res)=>{
    const playerId = req.params.id;
    const {points} = req.body
    const correctQuizIds = [1,2,3,4];
    const incorrectQuizIds = [1,2,3,4]
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