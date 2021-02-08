import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean,
} from "graphql";
import { TagType } from "./../tag/tag.type";
import TagModel from "./../tag/tag.model";
import { Lesson2Type } from "../lesson/lesson.type";
import LessonModel from "../lesson/lesson.model";
import { FavoriteType } from "../favorite/favorite.type";
import FavoriteModel from "../favorite/favorite.model";
import { LastReadType } from "../lastRead/lastRead.type";
import LastReadModel from "../lastRead/lastRead.model";
import _ from "lodash";

const OBJ = {
  id: {
    type: GraphQLID,
    description: "آیدی یکتا",
  },
  verse_id: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "شماره آیه",
  },
  text_arabic: {
    type: GraphQLNonNull(GraphQLString),
    required: true,
    description: "متن عربی",
  },
  text_persian: {
    type: GraphQLNonNull(GraphQLString),
    required: true,
    description: "متن فارسی",
  },
  new_words: {
    type: GraphQLNonNull(GraphQLString),
    required: true,
    description: "کلمات جدید",
    resolve: (args) => {
      let temp = args.new_words.replace(/\'/g, '"');
      return temp;
    },
  },
  component: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "جزء",
  },
  verse_words_count: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "تعداد کلمات آیه",
  },
  surah_id: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "آیدی سوره",
  },
  page: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "شماره صفحه",
  },
};

const VerseType = new GraphQLObjectType({
  name: "Verse",
  fields: () => ({
    ...OBJ,
    tags: {
      type: new GraphQLList(TagType),
      description: "لیست تگ‌های این آیه",
      args: {
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve: (parent, { page, count }, header) => {
        if (!page) page = 1;
        if (!count) count = 10;
        return TagModel.find(
          {
            surah_id: parent.surah_id,
            verse_id: parent.verse_id,
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
    },
    is_favorite: {
      type: FavoriteType,
      description:
        "اگر این آیه به علاقه‌مندی‌ها اضافه شده باشد میتوان آیدی آن را فراخوانی کرد",
      resolve: (parent, args, header) => {
        return FavoriteModel.findOne({
          surah_id: parent.surah_id,
          verse_id: parent.verse_id,
          user_id: header.account._id,
        })
          .then((result) => {
            return result;
          })
          .catch((error) => {
            throw error;
          });
      },
    },
    is_read: {
      type: LastReadType,
      description: "اگر این آیه خوانده شده بود میتوان آیدی آن را فراخوانی کرد",
      resolve: (parent, args, header) => {
        return LastReadModel.findOne({
          surah_id: parent.surah_id,
          verse_id: parent.verse_id,
          user_id: header.account._id,
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

const Verse2Type = new GraphQLObjectType({
  name: "Verse2",
  fields: () => ({
    ...OBJ,
    lesson: {
      type: Lesson2Type,
      description: "سوره مربوط به آیه",
      resolve: (parent, args) => {
        return LessonModel.findOne({
          surah_id: parent.surah_id,
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

export { VerseType, Verse2Type };
