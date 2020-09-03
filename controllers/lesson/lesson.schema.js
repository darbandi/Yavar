const graphql = require("graphql");
const LessonModel = require("./lesson.model");
const LessonType = require("./lesson.type");

const {
  GraphQLObjectType,
  GraphQLNonNull,
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
  type: LessonType.LessonType,
  description: "دریافت جزئیات یک سوره",
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
  type: new GraphQLList(LessonType.LessonType),
  description: "دریافت لیست سوره‌ها - فیلتر بر روی آیدی سوره",
  args: {
    surah_id: { type: GraphQLInt },
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { surah_id, page, count }) => {
    if (surah_id) {
      return LessonModel.find({
        surah_id: surah_id,
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
  description: "دریافت تعداد کل سوره‌ها",
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

const Query = new GraphQLObjectType({
  name: "Query",
  description: "دریافت اطلاعات سوره‌ها",
  fields: {
    lesson,
    lessons,
    lessonsCount,
  },
});

module.exports = new GraphQLSchema({
  query: Query,
});
