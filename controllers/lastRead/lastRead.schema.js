import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
} from "graphql";
import LastReadModel from "./lastRead.model";
import { LastReadType } from "./lastRead.type";
import { AccessToContent } from "../../Utils";

/**
 * get one lastRead
 */
const lastRead = {
  type: LastReadType,
  description: "دریافت جزئیات آخرین قرائت",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }, header) => {
    return LastReadModel.findById(id)
      .then((lastRead) => {
        return AccessToContent(lastRead, header, `${id} یافت نشد`);
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * get lastReads list
 */
const lastReads = {
  type: new GraphQLList(LastReadType),
  description: "دریافت لیست آخرین قرائت‌ها",
  args: {
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { page, count }, header) => {
    if (!page) page = 1;
    if (!count) count = 10;
    return LastReadModel.find(
      {
        user_id: header.account._id,
      },
      null,
      {
        skip: (page - 1) * count,
        limit: count,
      }
    )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * get total count of lastReads
 */
const lastReadsCount = {
  type: GraphQLInt,
  description: "دریافت تعداد کل قرائت‌های کاربر جاری",
  args: {},
  resolve: (parent, args, header) => {
    return LastReadModel.countDocuments({ user_id: header.account._id })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * add one lastRead
 */
const addLastRead = {
  type: LastReadType,
  description: "افزودن آخرین قرائت",
  args: {
    surah_id: { type: GraphQLInt },
    verse_id: { type: GraphQLInt },
  },
  resolve: (parent, { surah_id, verse_id }, header) => {
    return LastReadModel.findOne({
      surah_id,
      verse_id,
      user_id: header.account._id,
    })
      .then((result) => {
        if (result) throw new Error("این آیه قبلا قرائت شده است");
        const lastRead = new LastReadModel({
          surah_id,
          verse_id,
          user_id: header.account._id,
        });
        return lastRead.save();
      })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * delete lastRead
 */
const deleteLastRead = {
  type: LastReadType,
  description: "حذف آخرین قرائت",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }, header) => {
    //   return LastReadModel.deleteMany();
    return LastReadModel.findById(id)
      .then((lastRead) => {
        return AccessToContent(lastRead, header, `${id} یافت نشد`);
      })
      .then((lastRead) => {
        return lastRead.deleteOne();
      })
      .catch((err) => {
        throw err;
      });
  },
};

const Query = new GraphQLObjectType({
  name: "Query",
  description: "دریافت اطلاعات آخرین قرائت‌ها",
  fields: {
    lastRead,
    lastReads,
    lastReadsCount,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "ذخیره اطلاعات آخرین قرائت",
  fields: {
    addLastRead,
    deleteLastRead,
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
