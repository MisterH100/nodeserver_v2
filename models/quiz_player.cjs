const mongoose = require("mongoose");

//Data schema

const quizPlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  timeStamp: {
    type: Date,
    default: new Date(2024, 3, 16),
  },
  points: {
    type: Number,
    default: 0,
  },
  correctQuizzes: {
    type: [],
  },
  incorrectQuizzes: {
    type: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("quiz_player", quizPlayerSchema);
