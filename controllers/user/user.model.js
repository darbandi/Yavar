const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserType = new Schema({
  email: {
    type: String,
    required: true,
    placeholder: "Email of the user",
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserModel", UserType);
