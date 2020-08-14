const mongo = require("mongoose");
const Schema = mongo.Schema;

const carSchema = new Schema({
  name: String,
  color: String,
});

module.exports = mongo.model("Car", carSchema);
