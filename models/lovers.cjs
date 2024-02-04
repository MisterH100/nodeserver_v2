const mongoose = require("mongoose");

//Data schema
const loversSchema = new mongoose.Schema({
    girl: {
        type: String,
        maxLength: 200
    },
    boy: {
        type: String,
        maxLength: 200
    },
    sentAt: {
        type: Date, 
        default: Date.now()
    },
}); 

module.exports = mongoose.model("valentines_lovers", loversSchema );