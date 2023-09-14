const router = require("express").Router();
const Blog = require("../models/InsightsBlogs.cjs");

//Submit

router.post("/blog", async (req, res) => {
    try {
        const newBlog = new Blog({
            name: req.body.name,
            title: req.body.title,
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
router.get("/getBlogs", (req, res) => {
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

router.get("/getBlogs/:id", (req, res) => {
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


//delete one Blog 
router.delete('/getBlogs/:id', (req, res) => {
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