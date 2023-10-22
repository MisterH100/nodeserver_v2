const router = require("express").Router();
const Blog = require("../models/blogs.cjs");

//Submit

router.post("/blogs/new", async (req, res) => {
    try {
        const newBlog = new Blog({
            name: req.body.name,
            title: req.body.title,
            description: req.body.description,
            blog: req.body.blog,
            createdAt: new Date()
        });
        const blog = await newBlog.save();
        res.send(blog);
    }
    catch (err) {
        res.send(err);
    }
})

//get Blogs
router.get("/blogs", (req, res) => {
    try {
        Blog.find().sort({createdAt: "descending"})
        .then((blogs) => {
            res.send(blogs);
        });
    }
    catch (err) {
        res.send(err);
    }

})

//get one blog

router.get("/blogs/blog/:id", (req, res) => {
    const blogId = req.params.id;
    try {
        Blog.findById(blogId)
        .then((blog) => {
            res.send(blog);
        });
    }
    catch (err) {
        res.send(err);
    }
})

router.get("/blogs/search/:query", (req,res) =>{
    const query = req.params.query;
    try{
        Blog.find({$text:{$search:query}},{score:{$meta:"searchScore"}})
        .then((blogs) =>{
            res.send(blogs)
        });
    }
    catch (err) {
        res.send(err);
    }
})

//patch one blog

router.put('/blogs/like/:id', (req, res)=>{
    const blogId = req.params.id;
    const action = req.headers["action"];

    if(action == "like"){
        try {
            Blog.updateOne({"_id": blogId}, {$inc:{'likes':1}})
            .then(()=>{
                res.json("blog liked")
            })
        } catch (error) {
            res.json(error)
        }
    }
    if(action == "unlike"){
        try {
            Blog.updateOne({"_id": blogId}, {$inc:{'likes':-1}})
            .then(()=>{
                res.json("blog unliked")
            })
        } catch (error) {
            res.json(error)
        }
    }
})



//delete one Blog 
router.delete('/blogs/delete/:id', (req, res) => {
    const blogId = req.params.id;
    try {
        Blog.findByIdAndRemove(blogId)
        .then((blog) => {
            res.send(blog.name + blog.title + " deleted");
        });
    }
    catch (err) {
        res.send(err);
    }
})

module.exports = router;