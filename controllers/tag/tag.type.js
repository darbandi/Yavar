const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

const TagType = new GraphQLObjectType({
  name: "Tag",
  description: "the tag schema",
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "آیدی یکتا",
    },
    surah_id: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "آیدی سوره",
    },
    verse_id: {
      type: GraphQLNonNull(GraphQLInt),
      required: true,
      description: "ایدی آیه",
    },
    text: {
      type: GraphQLNonNull(GraphQLString),
      required: true,
      description: "متن تگ",
    },
    is_delete: {
      type: GraphQLNonNull(GraphQLBoolean),
      required: true,
      default: false,
      description: "حذف شده است یا نه",
    },
    created_at: {
      type: GraphQLNonNull(GraphQLString),
      default: Date.now,
      description: "تاریخ ایجاد",
    },
  }),
});

module.exports = TagType;
