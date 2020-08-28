const graphql = require("graphql");
const _ = require("lodash");
// const LessonType = require("./../lesson/lesson.type");
// const LessonModel = require("./../lesson/lesson.model");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
} = graphql;

const VerseType = new GraphQLObjectType({
  name: "Verse",
  description: "the surah schema",
  fields: () => ({
    id: { type: GraphQLID },
    verse_id: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "شماره آیه",
    },
    text_arabic: {
      type: GraphQLNonNull(GraphQLString),
      required: true,
      description: "متن عربی",
    },
    text_persian: {
      type: GraphQLNonNull(GraphQLString),
      required: true,
      description: "متن فارسی",
    },
    new_words: {
      type: GraphQLNonNull(GraphQLString),
      required: true,
      description: "کلمات جدید",
    },
    component: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "جزء",
    },
    verse_words_count: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "تعداد کلمات آیه",
    },
    surah_id: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "آیدی سوره",
    },
    page: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "شماره صفحه",
    },
  }),
});
module.exports = VerseType;
