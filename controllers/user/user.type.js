const graphql = require("graphql");
const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = graphql;

const OBJ = {
  id: {
    type: GraphQLID,
    description: "آیدی یکتا",
  },
  email: {
    type: GraphQLNonNull(GraphQLString),
    description: "پست الکترونیکی (ایمیل)",
  },
  password: {
    type: GraphQLNonNull(GraphQLString),
    description: "رمز عبور",
  },
  created_at: {
    type: GraphQLNonNull(GraphQLString),
    default: Date.now,
    description: "تاریخ ایجاد",
  },
};

const UserType = new GraphQLObjectType({
  name: "User",
  description: "the user schema",
  fields: () => ({
    ...OBJ
  }),
});

module.exports = UserType;
