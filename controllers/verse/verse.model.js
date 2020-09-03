import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VerseModel = new Schema({
  verse_id: {
    type: Number,
    required: true,
    description: "شماره آیه",
  },
  text_arabic: {
    type: String,
    required: true,
    description: "متن عربی",
  },
  text_persian: {
    type: String,
    required: true,
    description: "متن فارسی",
  },
  new_words: {
    type: String,
    required: true,
    description: "کلمات جدید",
  },
  component: {
    type: Number,
    required: true,
    description: "جزء",
  },
  verse_words_count: {
    type: Number,
    required: true,
    description: "تعداد کلمات آیه",
  },
  surah_id: {
    type: Number,
    required: true,
    description: "آیدی سوره",
  },
  page: {
    type: Number,
    required: true,
    description: "شماره صفحه",
  },
});

export default mongoose.model("Verse", VerseModel);
