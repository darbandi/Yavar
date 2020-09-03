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

const OBJ = {
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
};

const LessonType = new GraphQLObjectType({
  name: "Lesson",
  description: "اسکیمای سوره‌ها",
  fields: () => ({
    ...OBJ,
    verses: {
      type: new GraphQLList(VerseType.VerseType),
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
  }),
});

const Lesson2Type = new GraphQLObjectType({
  name: "Lesson2",
  description: "اسکیمای سوره‌ها",
  fields: () => ({
    ...OBJ
  }),
});

module.exports.LessonType = LessonType;
module.exports.Lesson2Type = Lesson2Type;
