const graphql = require("graphql");
const Lesson = require("./lesson.model");

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
} = graphql;

const LessonType = new GraphQLObjectType({
  name: "Lesson",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    key: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    lesson: {
      type: LessonType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        try {
          return Lesson.findById(args.id);
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    lessons: {
      type: new GraphQLList(LessonType),
      args: {
        key: { type: GraphQLString },
      },
      resolve(parent, args) {
        try {
          if (args.key) {
            return Lesson.find({
              key: args.key,
            });
          }
          return Lesson.find({});
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
});

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    addLesson: {
      type: LessonType,
      args: {
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
      resolve(parent, args) {
        try {
          let lesson = new Lesson({
            name: args.name,
            key: args.key,
          });
          return lesson.save();
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    updateLesson: {
      type: LessonType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
      async resolve(parent, args) {
        try {
          let lesson = await Lesson.findById(args.id);
          lesson.name = args.name;
          lesson.key = args.key;
          return lesson.save();
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    deleteLesson: {
      type: LessonType,
      args: {
        id: { type: GraphQLID },
      },
      async resolve(parent, args) {
        try {
          let lesson = await Lesson.findById(args.id);
          return lesson.deleteOne();
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
