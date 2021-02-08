import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FavoriteModel = new Schema({
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
  user_id: {
    type: String,
    description: "آیدی کاربر",
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

export default mongoose.model("Favorite", FavoriteModel);
