const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonType = new Schema({
  name: {
    type: String,
    required: true,
    placeholder: "Name of the lesson",
  },
  key: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
  },
});

module.exports = mongoose.model("LessonModel", LessonType);
