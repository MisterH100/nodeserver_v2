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
/*router.patch('/blogs/like/:id', (req, res)=>{
    const blogId = req.params.id;
    try {
        Blog.updateOne({"_id": blogId}, {$inc:{'likes':1}})
        .then((blog)=>{
            res.send(blog.acknowledged)
        })
    } catch (error) {
        res.send(error)
    }
})*/

router.post('/blogs/like/:id', (req, res,) => {
    const action = req.body.action;
    const blogId = req.params.id;
    const counter = action === 'Like' ? 1 : -1;
    Blog.updateOne({_id: blogId}, {$inc: {'likes': counter}})
    .then((blog)=>{
        res.send(action==='Like'? blog.acknowledged+ "  blog liked" : blog.acknowledged+ "  blog unliked" )
    })
});


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