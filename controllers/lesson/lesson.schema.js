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
  GraphQLInt,
} = graphql;

const LessonType = new GraphQLObjectType({
  name: "LessonType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    key: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: "QueryType",
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
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve(parent, { key, page, count }) {
        try {
          if (key) {
            return Lesson.find({
              key: key,
            });
          }

          if (!page) page = 1;
          if (!count) count = 10;

          return Lesson.find(null, null, {
            skip: (page - 1) * count,
            limit: count,
          });
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    lessonsCount: {
      type: GraphQLInt,
      args: {},
      resolve(parent, { key, page, count }) {
        try {
          return Lesson.countDocuments({}, (err, count) => {
            return count;
          });
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    addLesson: {
      type: LessonType,
      args: {
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
      resolve(parent, args) {
        try {
          const lesson = new Lesson({
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
          let lesson = await Lesson.findByIdAndUpdate(args.id);
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
  query: Query,
  mutation: Mutation,
});
