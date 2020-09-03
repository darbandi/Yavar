const graphql = require("graphql");
const UserType = require("./../user/user.type");
const UserModel = require("./../user/user.model");
const VerseType = require("./../verse/verse.type");
const VerseModel = require("./../verse/verse.model");

const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

const OBJ = {
  id: {
    type: GraphQLID,
    description: "آیدی یکتا",
  },
  surah_id: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "آیدی سوره",
  },
  verse_id: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "ایدی آیه",
  },
  text: {
    type: GraphQLNonNull(GraphQLString),
    required: true,
    description: "متن تگ",
  },
  is_delete: {
    type: GraphQLNonNull(GraphQLBoolean),
    required: true,
    default: false,
    description: "حذف شده است یا نه",
  },
  created_at: {
    type: GraphQLNonNull(GraphQLString),
    default: Date.now,
    description: "تاریخ ایجاد",
  },
  user_id: {
    type: GraphQLNonNull(GraphQLString),
    description: "آیدی کاربر",
  },
};

const TagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    ...OBJ,
    user: {
      type: UserType,
      description: "کاربر",
      resolve: (parent, args) => {
        return UserModel.findById(parent.user_id)
          .then((result) => {
            return result;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
    verse: {
      type: VerseType.Verse2Type,
      description: "آیه",
      resolve: (parent, args) => {
        return VerseModel.findOne({
          verse_id: parent.verse_id,
        })
          .then((result) => {
            return result;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
  }),
});

module.exports.TagType = TagType;
