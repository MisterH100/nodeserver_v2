import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    payment_id: {
      type: String,
    },
    transaction_id: {
      type: String,
    },
    customer_id: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    amount: {
      type: Number,
      default: 0,
    },
    payment_date: {
      type: Date,
      default: Date.now(),
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: ["credit card", "debit card", "paypal"],
      default: "debit card",
    },
    payment_type: {
      type: String,
      enum: ["credit", "debit"],
      default: "debit",
    },
    payment_description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("payment", paymentSchema);
export default Payment;
