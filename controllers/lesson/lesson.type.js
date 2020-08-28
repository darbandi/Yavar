const graphql = require("graphql");
const VerseType = require("./../verse/verse.type");
const VerseModel = require("./../verse/verse.model");

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
    id: { type: GraphQLID },
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
      args: {
        surah_id: { type: GraphQLInt },
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve: (parent, { surah_id, page, count }) => {
        if (surah_id) {
          return VerseModel.find({
            surah_id: surah_id,
          })
            .then((result) => {
              return result;
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!page) page = 1;
          if (!count) count = 10;
          return VerseModel.find(null, null, {
            skip: (page - 1) * count,
            limit: count,
          })
            .then((result) => {
              return result;
            })
            .catch((err) => {
              throw err;
            });
        }
      },
    },
  }),
});
module.exports = LessonType;
