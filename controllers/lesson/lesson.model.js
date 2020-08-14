const mongo = require("mongoose");
const Schema = mongo.Schema;

const lessonSchema = new Schema({
  name: String,
  key: String,
});

module.exports = mongo.model("Lesson", lessonSchema);
