const mongoose = require("mongoose");

//Data schema
const blogSchema = new mongoose.Schema({
    name: String,
    title: String,
    blog: String,
}); 

module.exports = mongoose.model("insights_blogs", blogSchema );