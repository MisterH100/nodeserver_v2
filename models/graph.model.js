import mongoose from "mongoose";

const graphDataSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    monthly_sales: {
      type: Number,
      default: 0,
    },
    monthly_product_sales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const GraphData = mongoose.model("graph_data", graphDataSchema);
export default GraphData;
