const mongoose = require("mongoose");

//Data schema
const productOrdersSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  name: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: Number,
  },
  products: {
    type: [],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  orderdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("product_orders", productOrdersSchema);
