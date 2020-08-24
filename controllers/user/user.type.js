const graphql = require("graphql");
const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = graphql;

const UserType = new GraphQLObjectType({
  name: "UserType",
  description: "the user schema",
  fields: () => ({
    id: { type: GraphQLID },
    email: {
      type: GraphQLNonNull(GraphQLString),
      description: "the field name",
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
      description: "the field key",
    },
  }),
});

module.exports = UserType;
