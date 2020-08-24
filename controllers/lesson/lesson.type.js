const graphql = require("graphql");
const UserType = require("./../user/user.type");
const UserModel = require("./../user/user.model");
const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = graphql;

const LessonType = new GraphQLObjectType({
  name: "LessonType",
  description: "the lesson schema",
  fields: () => ({
    id: { type: GraphQLID },
    name: {
      type: GraphQLNonNull(GraphQLString),
      description: "the field name",
    },
    key: {
      type: GraphQLNonNull(GraphQLString),
      description: "the field key",
    },
    user: {
      type: UserType,
      resolve: (parent, args) => {
        return UserModel.findById(parent.user_id);
      },
    },
  }),
});
module.exports = LessonType;
