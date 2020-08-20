const mongo = require("mongoose");
const Schema = mongo.Schema;

const lessonSchema = new Schema({
  name: { 
      type: String, 
      required: true, 
      placeholder: "Name of the lesson" 
    },
  key: String,
  created_at: { 
      type: Date, 
      default: Date.now 
    },
});

module.exports = mongo.model("Lesson", lessonSchema);
