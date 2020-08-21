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

const LessonSchema = new GraphQLObjectType({
  name: "LessonSchema",
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
  }),
});

const Query = new GraphQLObjectType({
  name: "QueryType",
  fields: {
    lesson: {
      type: LessonSchema,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, { id }) => {
        try {
          const result = await Lesson.findById(id);
          if (!result) return new Error(`id ${id} not found`);
          return result;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    lessons: {
      type: new GraphQLList(LessonSchema),
      args: {
        key: { type: GraphQLString },
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve: async (parent, { key, page, count }) => {
        try {
          if (key) {
            const result = await Lesson.find({
              key: key,
            });
            return result;
          }

          if (!page) page = 1;
          if (!count) count = 10;
          const result = await Lesson.find(null, null, {
            skip: (page - 1) * count,
            limit: count,
          });
          return result;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    lessonsCount: {
      type: GraphQLInt,
      args: {},
      resolve: async (parent) => {
        try {
          const result = await Lesson.countDocuments({}, (err, count) => {
            return count;
          });
          return result;
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
      type: LessonSchema,
      args: {
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
      resolve: async (parent, { key, name }) => {
        try {
          const lesson = new Lesson({
            name: name,
            key: key,
          });
          return lesson.save();
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    updateLesson: {
      type: LessonSchema,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
      resolve: async (parent, { key, id, name }) => {
        try {
          let lesson = await Lesson.findByIdAndUpdate(id);
          if (name) lesson.name = name;
          if (key) lesson.key = key;
          return lesson.save();
        } catch (error) {
          throw new Error(error);
        }
      },
    },
    deleteLesson: {
      type: LessonSchema,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (parent, { id }) => {
        try {
          let lesson = await Lesson.findById(id);
          if (!lesson) return new Error(`id ${id} not found`);
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
