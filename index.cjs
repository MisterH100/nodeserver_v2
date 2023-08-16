const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const app = express();
const emailRoute = require("./routes/contactEmails.cjs");
require('dotenv').config();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.CONNECT_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log("Connected to MongoDB")) 
.catch((err) => {
    console.log(err)
    
});

app.use("/api", emailRoute);

app.listen(process.env.PORT , () => {
    console.log(`listening on port ${process.env.PORT }`);
});