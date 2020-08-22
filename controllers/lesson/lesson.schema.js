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
      resolve: (parent, { id }) => {
        return Lesson.findById(id)
          .then((result) => {
            if (!result) return new Error(`id ${id} not found`);
            return result;
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    lessons: {
      type: new GraphQLList(LessonSchema),
      args: {
        key: { type: GraphQLString },
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve: (parent, { key, page, count }) => {
        if (key) {
          return Lesson.find({
            key: key,
          })
            .then((result) => {
              return result;
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!page) page = 1;
          if (!count) count = 10;
          return Lesson.find(null, null, {
            skip: (page - 1) * count,
            limit: count,
          })
            .then((result) => {
              return result;
            })
            .catch((err) => {
              throw err;
            });
        }
      },
    },
    lessonsCount: {
      type: GraphQLInt,
      args: {},
      resolve: (parent) => {
        return Lesson.countDocuments({})
          .then((result) => {
            return result;
          })
          .catch((err) => {
            throw err;
          });
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
      resolve: (parent, { key, name }) => {
        const lesson = new Lesson({
          name: name,
          key: key,
        });
        return lesson
          .save()
          .then((lesson) => {
            return lesson;
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    updateLesson: {
      type: LessonSchema,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        key: { type: GraphQLString },
      },
      resolve: (parent, { key, id, name }) => {
        return (
          Lesson.findByIdAndUpdate(id)
            .then((lesson) => {
              if (name) lesson.name = name;
              if (key) lesson.key = key;
              return lesson.save();
            })
            .catch((err) => {
              throw err;
            })
        );
      },
    },
    deleteLesson: {
      type: LessonSchema,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, { id }) => {
        return Lesson.findById(id)
          .then((lesson) => {
            if (!lesson) return new Error(`id ${id} not found`);
            return lesson.deleteOne();
          })
          .catch((err) => {
            throw err;
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
