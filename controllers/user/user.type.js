const graphql = require("graphql");
const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  description: "the user schema",
  fields: () => ({
    id: {
      type: GraphQLID,
      description: "آیدی یکتا",
    },
    email: {
      type: GraphQLNonNull(GraphQLString),
      description: "email address",
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
      description: "password",
    },
  }),
});

module.exports = UserType;
