const mongoose = require("mongoose");

//Data schema
const emailSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: String,
    message: String,
}); 

module.exports = mongoose.model("contact_emails", emailSchema);