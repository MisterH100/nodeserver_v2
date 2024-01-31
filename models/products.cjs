const mongoose = require("mongoose");

//Data schema
const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    brand: {
       type: String,
        default: "No name"
    },
    description:{
        type: String,
    },
    price:{
        type: Number, 
        default: 0
    },
    stock_quantity:{
        type: Number, 
        default: 0
    },
    categories:{
        type: [
            {
                category_id: Number,
                category_name: String
            }
        ],
    },
    reviews:{
        type:[
            {
                user_id: Number,
                review_id: Number,
                review: Number,
                comment: String,
                review_date: {type: Date, default: Date.now()}
            }
        ]
    },
    product_images:{
        type:[
            {
                data:Buffer,
                image_url: String,
                contentType: String
            }
        ]
    },
    createdAt: {type: Date, default: Date.now()},
}); 

module.exports = mongoose.model("products", ProductSchema );