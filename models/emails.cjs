const mongoose = require("mongoose");

//Data schema
const emailSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  sentAt: Date,
});

module.exports = mongoose.model("contact_emails", emailSchema);
