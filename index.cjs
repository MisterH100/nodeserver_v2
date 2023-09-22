const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const app = express();
const emailRoute = require("./routes/contactEmails.cjs");
const blogRoute = require("./routes/blogs.cjs");
require('dotenv').config();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log("Connected to MongoDB")) 
.catch((err) => {
    console.log(err + "Failed to Connect to MongoDB") 
});

app.use("/",(req,res)=>{
    res.send("Hello,Server started");
});
app.use("/api", emailRoute);
app.use("/api", blogRoute);

app.listen(process.env.PORT , () => {
    console.log(`listening on port ${process.env.PORT }`);
});