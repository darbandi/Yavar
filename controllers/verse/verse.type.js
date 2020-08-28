const graphql = require("graphql");
const _ = require("lodash");
// const LessonType = require("./../lesson/lesson.type");
// const LessonModel = require("./../lesson/lesson.model");
const TagType = require("./../tag/tag.type");
const TagModel = require("./../tag/tag.model");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = graphql;

const VerseType = new GraphQLObjectType({
  name: "Verse",
  description: "the surah schema",
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
    tags: {
      type: new GraphQLList(TagType),
      description: "لیست تگ‌های این آیه",
      args: {
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve: (parent, { page, count }) => {
        if (!page) page = 1;
        if (!count) count = 10;
        return TagModel.find(
          {
            surah_id: parent.surah_id,
            verse_id: parent.verse_id,
          },
          null,
          {
            skip: (page - 1) * count,
            limit: count,
          }
        )
          .then((result) => {
            return result;
          })
          .catch((err) => {
            throw err;
          });
      },
    },
  }),
});
module.exports = VerseType;
