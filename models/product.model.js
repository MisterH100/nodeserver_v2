import mongoose from "mongoose";

//Data schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  brand: {
    type: String,
    default: "No name",
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  in_stock: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  categories: {
    type: [String],
  },
  reviews: {
    type: [
      {
        user_id: Number,
        review: Number,
        comment: String,
        review_date: { type: Date, default: Date.now() },
      },
    ],
  },
  images: {
    type: [String],
  },
  createdAt: { type: Date, default: Date.now() },
});

const Product = mongoose.model("products", ProductSchema);
export default Product;