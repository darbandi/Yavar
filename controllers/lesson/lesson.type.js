const graphql = require("graphql");
const VerseType = require("./../verse/verse.type");
const VerseModel = require("./../verse/verse.model");
// const TagType = require("./../tag/tag.type");
// const TagModel = require("./../tag/tag.model");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = graphql;

const LessonType = new GraphQLObjectType({
  name: "Lesson",
  description: "the surah schema",
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "آیدی یکتا",
    },
    surah_id: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "شماره سوره",
    },
    order: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "ترتیب سوره",
    },
    surah_name: {
      type: GraphQLNonNull(GraphQLString),
      required: true,
      description: "نام سوره",
    },
    verse_count: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "تعداد آیه‌های سوره",
    },
    sequence_of_descent: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "ترتیب نزول سوره",
    },
    place_of_descent: {
      type: GraphQLNonNull(GraphQLString),
      required: true,
      description: "محل نزول سوره",
    },
    verses: {
      type: new GraphQLList(VerseType),
      description: "لیست آیه‌های این سوره ",
      args: {
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve: (parent, { page, count }) => {
        if (!page) page = 1;
        if (!count) count = 10;
        return VerseModel.find({ surah_id: parent.surah_id }, null, {
          skip: (page - 1) * count,
          limit: count,
        })
          .then((result) => {
            return result;
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    // tags: {
    //   type: new GraphQLList(TagType),
    //   description: "لیست تگ‌های این سوره",
    //   args: {
    //     page: { type: GraphQLInt },
    //     count: { type: GraphQLInt },
    //   },
    //   resolve: (parent, { page, count }) => {
    //     if (!page) page = 1;
    //     if (!count) count = 10;
    //     return TagModel.find({ surah_id: parent.surah_id }, null, {
    //       skip: (page - 1) * count,
    //       limit: count,
    //     })
    //       .then((result) => {
    //         return result;
    //       })
    //       .catch((err) => {
    //         throw err;
    //       });
    //   },
    // },
  }),
});
module.exports = LessonType;
