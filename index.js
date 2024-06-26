import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import schedule from "node-schedule";
import connectToDatabase from "./db/connectToDatabase.js";
import productRoute from "./routes/product.route.js";
import homeRoute from "./routes/home.route.js";
import productOrderRoute from "./routes/product_order.route.js";
import userRoute from "./routes/user.route.js";
import activityRoute from "./routes/activity.route.js";
import statsRoute from "./routes/stats.route.js";
import paymentRoute from "./routes/payment.route.js";
import { updateGraphData } from "./lib/dataUpdate.js";

const app = express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/", homeRoute);
app.use("/api", productRoute);
app.use("/api", productOrderRoute);
app.use("/api", userRoute);
app.use("/api", activityRoute);
app.use("/api", paymentRoute);
app.use("/api", statsRoute);

app.listen(process.env.PORT || 5000, () => {
  connectToDatabase();
  console.log(`listening on port ${process.env.PORT || 5000}`);
  schedule.scheduleJob("0 0 28 * *", () => {
    updateGraphData();
  });
});
