const mongoose = require("mongoose");

//Data schema

const userSchema = new mongoose.Schema({
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
    createdAt: Date,
},); 

module.exports = mongoose.model("user_accounts", userSchema);