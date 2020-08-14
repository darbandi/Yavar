const graphql = require("graphql");
const Car = require("./car.model");

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} = graphql;

const CarType = new GraphQLObjectType({
  name: "Car",
  fields: () => ({
    id: { type: GraphQLID },
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
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Car.findById(args.id);
      },
    },
    cars: {
      type: new GraphQLList(CarType),
      args: {
        color: { type: GraphQLString },
      },
      resolve(parent, args) {
        if (args.color) {
          return Car.find({
            color: args.color,
          });
        }
        return Car.find({});
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    addCar: {
      type: CarType,
      args: {
        name: { type: GraphQLString },
        color: { type: GraphQLString },
      },
      resolve(parent, args) {
        let car = new Car({
          name: args.name,
          color: args.color,
        });
        return car.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
