const graphql = require("graphql");
const TagModel = require("./tag.model");
const bcrypt = require("bcryptjs");
const TagType = require("./tag.type");
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
 * get one tag
 */
const tag = {
  type: TagType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }, header) => {
    return TagModel.findById(id)
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
      return TagModel.find(null, null, {
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
 * get total count of tags
 */
const tagsCount = {
  type: GraphQLInt,
  args: {},
  resolve: (parent) => {
    return TagModel.countDocuments({})
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
    is_delete: { type: GraphQLBoolean, default: false },
  },
  resolve: (parent, { id, text, is_delete = false }, header) => {
    return TagModel.findByIdAndUpdate(id)
      .then((tag) => {
        if (text) tag.text = text;
        tag.is_delete = is_delete;
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
  resolve: (parent, { id }) => {
    //   return TagModel.deleteMany();
    return TagModel.findById(id)
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
