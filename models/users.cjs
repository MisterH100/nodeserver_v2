const mongoose = require("mongoose");

//Data schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    profileImage:{
        data:Buffer,
        image_url: String,
        contentType: String 
    },
    createdAt: Date,
},); 

module.exports = mongoose.model("user_accounts", userSchema);