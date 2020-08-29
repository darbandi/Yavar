const graphql = require("graphql");
const _ = require("lodash");
const LessonType = require("../lesson/lesson2.type");
const LessonModel = require("../lesson/lesson.model");

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = graphql;

const Verse2Type = new GraphQLObjectType({
  name: "Verse2",
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "آیدی یکتا",
    },
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
    lesson: {
      type: LessonType,
      resolve: (parent, args) => {
        return LessonModel.findOne({
          surah_id: parent.surah_id,
        })
          .then((result) => {
            return result;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  }),
});
module.exports = Verse2Type;
