const mongoose = require("mongoose");
const { Schema } = mongoose;

//Data schema
const productOrdersSchema = new mongoose.Schema(
  {
    order_number: {
      type: String,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    products: [{ type: Schema.Types.ObjectId, ref: "products" }],
    payment_method: {
      type: String,
    },
    terms: {
      type: Boolean,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    orderDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product_orders", productOrdersSchema);
