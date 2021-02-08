import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
} from "graphql";
import VerseModel from "./verse.model";
import { VerseType } from "./verse.type";

/**
 * get one verse
 */
const verse = {
  type: VerseType,
  description: "دریافت جزئیات یک آیه",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }) => {
    return VerseModel.findById(id)
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
 * get verses list
 */
const verses = {
  type: new GraphQLList(VerseType),
  description: "دریافت لیست آیه‌ها - فیلتر بر روی آیدی آیه",
  args: {
    verse_id: { type: GraphQLInt },
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { verse_id, page = 1, count = 10 }) => {
    if (verse_id) {
      return VerseModel.find({
        verse_id: verse_id,
      })
        .then((result) => {
          return result;
        })
        .catch((err) => {
          throw err;
        });
    } else {
      return VerseModel.find(null, null, {
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
 * get total count of verses
 */
const versesCount = {
  type: GraphQLInt,
  description: "دریافت تعداد کل آیه‌ها",
  args: {},
  resolve: (parent) => {
    return VerseModel.countDocuments({})
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
  description: "دریافت اطلاعات آیه‌ها",
  fields: {
    verse,
    verses,
    versesCount,
  },
});

export default new GraphQLSchema({
  query: Query,
});
