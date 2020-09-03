import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LessonModel = new Schema({
  surah_id: {
    type: Number,
    required: true,
    description: "شماره سوره",
  },
  order: {
    type: Number,
    required: true,
    description: "ترتیب سوره",
  },
  surah_name: {
    type: String,
    required: true,
    description: "نام سوره",
  },
  verse_count: {
    type: Number,
    required: true,
    description: "تعداد آیه‌های سوره",
  },
  sequence_of_descent: {
    type: Number,
    required: true,
    description: "ترتیب نزول سوره",
  },
  place_of_descent: {
    type: String,
    required: true,
    description: "محل نزول سوره",
  },
});

export default mongoose.model("Lesson", LessonModel);
