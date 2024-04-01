import mongoose from "mongoose";

//Data schema
const productOrdersSchema = new mongoose.Schema(
  {
    order_number: {
      type: String,
    },
    customer_id: {
      type: mongoose.SchemaTypes.ObjectId,
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
    products: [],
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
    price: {
      type: Number,
      default: 0,
    },
    orderDate: {
      type: Date,
      default: Date.now(),
    },
    order_status: {
      type: String,
      enum: ["pending", "collected", "completed", "cancelled", "delayed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ProductOrder = mongoose.model("product_orders", productOrdersSchema);
export default ProductOrder;
