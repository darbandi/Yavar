import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
} from "graphql";
import LessonModel from "./lesson.model";
import { LessonType } from "./lesson.type";

/**
 * get one lesson
 */
const lesson = {
  type: LessonType,
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
  type: new GraphQLList(LessonType),
  description: "دریافت لیست سوره‌ها - فیلتر بر روی آیدی سوره",
  args: {
    surah_id: { type: GraphQLInt },
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { surah_id, page = 1, count = 10 }) => {
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

export default new GraphQLSchema({
  query: Query,
});
