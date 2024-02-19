const mongoose = require("mongoose");

//Data schema
const generalQuizSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  question: {
    type: String,
  },
  answers: {
    type: [
      {
        id: {
          type: Number,
          unique: true,
        },
        name: String,
      },
    ],
  },
  correctAnswer: {
    type: String,
  },
  points: {
    type: Number,
    default: 50,
  },
  answered: {
    type: Boolean,
    default: false,
  },
  answer: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("general_quizzes", generalQuizSchema);
