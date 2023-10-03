const mongoose = require("mongoose");

//Data schema
const ProductSchema = new mongoose.Schema({
    seller: {
        type: String, 
        maxLength: 200
    },
    name: {
        type: String, 
        maxLength: 200
    },
    brand: {
        type: String,
        default: "Brand Name"
    },
    description: {
        type: String, 
        maxLength: 300
    },
    price:{
        type: Number, 
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    },
    category: {type:[String]},
    gender: {
        type: String, 
        default: "unisex"
    },
    sizes: {
        clothing: {
            type: [String], 
            default:["xs","s","m","l", "xl","xxl"]
        },
        shoes: {
            type: [String], 
            default:["1","2","3","4","5","6","7","8","9","10"]
        }
    },
    productImages:{
        image_one: {
            data:Buffer,
            image_url: String,
            contentType: String
        },
        image_two: {
            data:Buffer,
            image_url: String,
            contentType: String
        },
        image_three: {
            data:Buffer,
            image_url: String,
            contentType: String
        },
    },
    createdAt: {type: Date, default: Date.now()},
}); 

module.exports = mongoose.model("products", ProductSchema );