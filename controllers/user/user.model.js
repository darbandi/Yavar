const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema({
  email: {
    type: String,
    required: true,
    description: "پست الکترونیکی (ایمیل)",
  },
  password: {
    type: String,
    required: true,
    min: 6,
    description: "رمز عبور",
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: "تاریخ ایجاد",
  },
});

module.exports = mongoose.model("User", UserModel);
