const graphql = require("graphql");
const TagModel = require("./tag.model");
const TagType = require("./tag.type");
const { AccessToContent } = require("./../../Utils");

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
 * get one tag
 */
const tag = {
  type: TagType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }, header) => {
    return TagModel.findById(id)
      .then((tag) => {
        return AccessToContent(tag, header, `id ${id} not found`);
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * get tags list
 */
const tags = {
  type: new GraphQLList(TagType),
  args: {
    text: { type: GraphQLString },
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { text, page, count }, header) => {
    if (text) {
      return TagModel.find({
        text: text,
        user_id: header.account._id,
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
      return TagModel.find(
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
    }
  },
};

/**
 * get total count of tags
 */
const tagsCount = {
  type: GraphQLInt,
  args: {},
  resolve: (parent, args, header) => {
    return TagModel.countDocuments({ user_id: header.account._id })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * add one tag
 */
const addTag = {
  type: TagType,
  args: {
    surah_id: { type: GraphQLInt },
    verse_id: { type: GraphQLInt },
    text: { type: GraphQLString },
  },
  resolve: (parent, { surah_id, verse_id, text }, header) => {
    const tag = new TagModel({
      surah_id,
      verse_id,
      text,
      user_id: header.account._id,
    });
    return tag
      .save()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * update one tag
 */
const updateTag = {
  type: TagType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    text: { type: GraphQLString },
  },
  resolve: (parent, { id, text }, header) => {
    return TagModel.findByIdAndUpdate(id)
      .then((tag) => {
        return AccessToContent(tag, header, `id ${id} not found`);
      })
      .then((tag) => {
        if (text) tag.text = text;
        return tag.save();
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * delete tag
 */
const deleteTag = {
  type: TagType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }, header) => {
    //   return TagModel.deleteMany();
    return TagModel.findById(id)
      .then((tag) => {
        return AccessToContent(tag, header, `id ${id} not found`);
      })
      .then((tag) => {
        if (!tag) return new Error(`id ${id} not found`);
        return tag.deleteOne();
      })
      .catch((err) => {
        throw err;
      });
  },
};

const Query = new GraphQLObjectType({
  name: "Query",
  description:"test",
  fields: {
    tag,
    tags,
    tagsCount,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTag,
    updateTag,
    deleteTag,
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
