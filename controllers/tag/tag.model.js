const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagModel = new Schema({
  surah_id: {
    type: Number,
    required: true,
    description: "آیدی سوره",
  },
  verse_id: {
    type: Number,
    required: true,
    description: "ایدی آیه",
  },
  text: {
    type: String,
    required: true,
    description: "متن تگ",
  },
  is_delete: {
    type: Boolean,
    required: true,
    default: false,
    description: "حذف شده است یا نه",
  },
  created_at: {
    type: Date,
    default: Date.now,
    description: "تاریخ ایجاد",
  },
});

module.exports = mongoose.model("Tag", TagModel);
