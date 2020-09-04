import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";
import UserType from "../user/user.type";
import UserModel from "../user/user.model";
import { Verse2Type } from "../verse/verse.type";
import VerseModel from "../verse/verse.model";

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
  user_id: {
    type: GraphQLNonNull(GraphQLString),
    description: "آیدی کاربر",
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
};

const FavoriteType = new GraphQLObjectType({
  name: "Favorite",
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
      type: Verse2Type,
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

export { FavoriteType };
