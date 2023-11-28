const router = require("express").Router();
const Albums = require("../models/music_albums.cjs");
const multer = require('multer');
const { GridFsStorage } = require("multer-gridfs-storage");
const url = process.env.MONGO_STRING;
const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const mongoClient = new MongoClient(url);



const storage = new GridFsStorage({
    url,
    file: (req, file) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            return {
                bucketName: "album_covers",
                filename: `${file.fieldname}_${file.originalname}`,
            }
        } else {
            return {
                bucketName:"songs",
                filename: `${file.fieldname}_${file.originalname}`,
            }

        }
    },
})
    
const upload = multer({ storage });

router.post("/albums/new",upload.single('albumCover'),async (req, res) => {
    const file = req.file;
    const imageUrl = req.protocol + '://' + req.get('host');
    const albumID = Math.floor(Math.random()*100)+Date.now()+Math.floor(Math.random()*100);
    try {
        const newAlbum = new Albums({
            albumId: albumID,
            artist: req.body.artist,
            genre: req.body.genre,
            title: req.body.title,
            cover:{
                image: {
                    data: file.filename,
                    image_url: imageUrl + '/api/albums/album_covers/' + file.fieldname + "_" + file.originalname,
                    contentType: file.contentType
                }
            },
            release_date: Date.now(),
            soundCloudLink: req.body.soundCloudLink,
            songs: {},   
        });
        const album = await newAlbum.save();
        res.send(album);
    }
    catch (err) {
        res.send(err);
    }
});

//upload songs

router.post("/upload_songs/:id",upload.array('songs'), async (req,res)=>{
    const albumID = req.params.id;
    const imageUrl = req.protocol + '://' + req.get('host');
    const files = req.files;
    let audios =[];

    const loadAudios =(array)=>{
        if(array){
            array.map((item)=>{
                audios.push({
                    songId: Math.floor(Math.random()*100)+Date.now()+Math.floor(Math.random()*100),
                    title: item.originalname,
                    artist: req.body.artist,
                    file:{
                        data: item.filename,
                        song_url: imageUrl + '/api/albums/songs/' + item.fieldname + "_" + item.originalname ,
                        contentType: item.contentType
                    },
                    duration: item.size,
                    listens: 0,
                    album: {
                        album_name: "DTM",
                        album_id: albumID,
                    }
                })
            })       
        }
        
    }
    loadAudios(files)
    try {
        Albums.findOneAndUpdate({albumId:albumID},{$set:{songs:audios}})
        .then((album)=>{
            res.send(album)
        })
    } catch (error) {
        res.send(error)
    }
})

//get albums
router.get("/albums", (req, res) => {
    try {
        Albums.find()
        .then((albums) => {
            res.send(albums);
        });
    }
    catch (err) {
        res.send(err);
    }

})

//get songs from album
router.get("/album/songs/:albumId", (req,res) =>{
    const albumID = req.params.albumId
    try {
        Albums.findOne({albumId:albumID})
        .then((album)=>{
            res.send(album.songs)
        })
    } catch (error) {
        res.send(error)
    }
})


//get album covers
router.get("/albums/album_covers/:filename", async(req,res) =>{
    const filename = req.params.filename;
    try {
        await mongoClient.connect()
        const database = mongoClient.db("test")
        const imageBucket = new GridFSBucket(database, {
          bucketName: "album_covers",
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

//get songs
router.get("/albums/songs/:filename", async(req,res) =>{
    const filename = req.params.filename;
    try {
        await mongoClient.connect()
        const database = mongoClient.db("test")
        const imageBucket = new GridFSBucket(database, {
          bucketName: "songs",
        })
    
        let downloadStream = imageBucket.openDownloadStreamByName(
          filename
        )
        downloadStream.on("data", (data) => {
          return res.status(200).write(data)
        })
    
        downloadStream.on("error",(data) => {
          return res.status(404).send({ error: "audio not found" })
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