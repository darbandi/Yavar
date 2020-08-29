const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = graphql;

const Lesson2Type = new GraphQLObjectType({
  name: "Lesson2",
  description: "اسکیمای سوره‌ها",
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
  }),
});
module.exports = Lesson2Type;
