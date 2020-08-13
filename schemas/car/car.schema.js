const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = graphql;

let cars = [
  { name: "Honda", color: "Red", id: "1" },
  { name: "Toyota", color: "Blue", id: "2" },
  { name: "BMW", color: "Blue", id: "3" },
];

const CarType = new GraphQLObjectType({
  name: "Car",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    color: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    car: {
      type: CarType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.id) {
          return cars.find((car) => (car.id = args.id));
        }
        return null;
      },
    },
    cars: {
      type: new GraphQLList(CarType),
      args: {
        color: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.color) {
          return cars.filter((car) => car.color === args.color);
        }
        return cars;
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    car: {
      type: CarType,
      args: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        color: { type: GraphQLString },
      },
      resolve(parent, args) {
        return null;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
