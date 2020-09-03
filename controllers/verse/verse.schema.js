const graphql = require("graphql");
const VerseModel = require("./verse.model");
const VerseType = require("./verse.type");

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
 * get one verse
 */
const verse = {
  type: VerseType.VerseType,
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
  type: new GraphQLList(VerseType.VerseType),
  description: "دریافت لیست آیه‌ها - فیلتر بر روی آیدی آیه",
  args: {
    verse_id: { type: GraphQLInt },
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { verse_id, page, count }) => {
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
      if (!page) page = 1;
      if (!count) count = 10;
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

module.exports = new GraphQLSchema({
  query: Query,
});
