const mongoose = require("mongoose");

//Data schema
const blogSchema = new mongoose.Schema({
    name: {type: String, maxLength: 200},
    title: {type: String, maxLength: 200},
    description: {type: String},
    blog: String,
    likes: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now()},
}); 

module.exports = mongoose.model("insights_blogs", blogSchema );