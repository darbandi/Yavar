const graphql = require("graphql");
const LessonModel = require("./lesson.model");
const LessonType = require("./lesson.type");
const jwt = require("jsonwebtoken");

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

/**
 * get one lesson
 */
const lesson = {
  type: LessonType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }) => {
    return LessonModel.findById(id)
      .then((result) => {
        if (!result) return new Error(`id ${id} not found`);
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * get lessons list
 */
const lessons = {
  type: new GraphQLList(LessonType),
  args: {
    key: { type: GraphQLString },
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { key, page, count }) => {
    if (key) {
      return LessonModel.find({
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
      return LessonModel.find(null, null, {
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
};

/**
 * get total count of lessons
 */
const lessonsCount = {
  type: GraphQLInt,
  args: {},
  resolve: (parent) => {
    return LessonModel.countDocuments({})
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * add one lesson
 */
const addLesson = {
  type: LessonType,
  args: {
    name: { type: GraphQLString },
    key: { type: GraphQLString },
  },
  resolve: (parent, { key, name }) => {
    const lesson = new LessonModel({
      name: name,
      key: key,
      user_id: "5f441093f493dd4c7098d8d0",
    });
    return lesson
      .save()
      .then((lesson) => {
        console.log("lesson : ", lesson);
        return lesson;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * update one lesson
 */
const updateLesson = {
  type: LessonType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    key: { type: GraphQLString },
  },
  resolve: (parent, { key, id, name }) => {
    return LessonModel.findByIdAndUpdate(id)
      .then((lesson) => {
        if (name) lesson.name = name;
        if (key) lesson.key = key;
        return lesson.save();
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * delete lesson
 */
const deleteLesson = {
  type: LessonType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }) => {
    //    return LessonModel.deleteMany()
    return LessonModel.findById(id)
      .then((lesson) => {
        if (!lesson) return new Error(`id ${id} not found`);
        return lesson.deleteOne();
      })
      .catch((err) => {
        throw err;
      });
  },
};

const Query = new GraphQLObjectType({
  name: "QueryType",
  fields: {
    lesson,
    lessons,
    lessonsCount,
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: { addLesson, updateLesson, deleteLesson },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
