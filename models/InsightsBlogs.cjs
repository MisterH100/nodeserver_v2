const mongoose = require("mongoose");

//Data schema
const blogSchema = new mongoose.Schema({
    name: String,
    title: String,
    blog: String,
    likes: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now()},
}); 

module.exports = mongoose.model("insights_blogs", blogSchema );