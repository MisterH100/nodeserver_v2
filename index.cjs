const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
app.use(cors());
app.use(express.json());
require('dotenv').config();
const emailRoute = require("./routes/emails.cjs");
const blogRoute = require("./routes/blogs.cjs");
const productRoute = require("./routes/products.cjs")
const homeRoute = require("./routes/home.cjs");
const productOrder = require("./routes/product_orders.cjs");
const userRoute = require("./routes/users.cjs");
const albumRoute = require("./routes/music_albums.cjs");
const loversRoute = require("./routes/lovers.cjs");
const generalQuizRoute = require("./routes/general_quizzes.cjs");
const quizPlayerRoute = require("./routes/quiz_player.cjs")

mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log("Connected to DataBase")) 
.catch((err) => {
    console.log(err + "Failed to Connect to DataBase") 
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/",homeRoute);
app.use("/api", emailRoute);
app.use("/api", blogRoute);
app.use("/api", productRoute);
app.use("/api", productOrder);
app.use("/api", userRoute);
app.use("/api", albumRoute);
app.use("/api",loversRoute);
app.use("/api",generalQuizRoute);
app.use("/api",quizPlayerRoute)

app.listen(process.env.PORT || 5000 , () => {
    console.log(`listening on port ${process.env.PORT || 5000 }`);
});