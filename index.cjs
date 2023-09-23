const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();
const emailRoute = require("./routes/contactEmails.cjs");
const blogRoute = require("./routes/blogs.cjs");
const homeRoute = require("./routes/home.cjs");


mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log("Connected to DataBase")) 
.catch((err) => {
    console.log(err + "Failed to Connect to DataBase") 
});

app.use("/",homeRoute);
app.use("/api", emailRoute);
app.use("/api", blogRoute);

app.listen(process.env.PORT || 5000 , () => {
    console.log(`listening on port ${process.env.PORT || 5000 }`);
});