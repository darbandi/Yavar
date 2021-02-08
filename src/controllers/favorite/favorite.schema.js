import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLInt,
} from "graphql";
import FavoriteModel from "./favorite.model";
import { FavoriteType } from "./favorite.type";
import { AccessToContent } from "../../Utils";

/**
 * get one favorite
 */
const favorite = {
  type: FavoriteType,
  description: "دریافت جزئیات یک علاقه‌مندی",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }, header) => {
    return FavoriteModel.findById(id)
      .then((favorite) => {
        return AccessToContent(favorite, header, `${id} یافت نشد`);
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * get favorites list
 */
const favorites = {
  type: new GraphQLList(FavoriteType),
  description: "دریافت لیست علاقه‌مندی‌ها",
  args: {
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { page = 1, count = 10 }, header) => {
    return FavoriteModel.find(
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
 * get total count of favorites
 */
const favoritesCount = {
  type: GraphQLInt,
  description: "دریافت تعداد کل علاقه‌مندی‌های کاربر جاری",
  args: {},
  resolve: (parent, args, header) => {
    return FavoriteModel.countDocuments({ user_id: header.account._id })
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * add one favorite
 */
const addFavorite = {
  type: FavoriteType,
  description: "افزودن علاقه‌مندی",
  args: {
    surah_id: { type: GraphQLInt },
    verse_id: { type: GraphQLInt },
  },
  resolve: (parent, { surah_id, verse_id }, header) => {
    return FavoriteModel.findOne({
      surah_id,
      verse_id,
      user_id: header.account._id,
    })
      .then((result) => {
        if (result) throw new Error("این آیه قبلا علاقه‌مندی شده است");
        const favorite = new FavoriteModel({
          surah_id,
          verse_id,
          user_id: header.account._id,
        });
        return favorite.save();
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
 * delete favorite
 */
const deleteFavorite = {
  type: FavoriteType,
  description: "حذف یک علاقه‌مندی",
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }, header) => {
    //   return FavoriteModel.deleteMany();
    return FavoriteModel.findById(id)
      .then((favorite) => {
        return AccessToContent(favorite, header, `${id} یافت نشد`);
      })
      .then((favorite) => {
        return favorite.deleteOne();
      })
      .catch((err) => {
        throw err;
      });
  },
};

const Query = new GraphQLObjectType({
  name: "Query",
  description: "دریافت اطلاعات علاقه‌مندی‌ها",
  fields: {
    favorite,
    favorites,
    favoritesCount,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "ذخیره اطلاعات علاقه‌مندی",
  fields: {
    addFavorite,
    deleteFavorite,
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
