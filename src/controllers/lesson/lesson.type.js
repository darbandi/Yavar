import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} from "graphql";
import { VerseType } from "./../verse/verse.type";
import VerseModel from "./../verse/verse.model";
import { LastReadType } from "./../lastRead/lastRead.type";
import LastReadModel from "./../lastRead/lastRead.model";

const OBJ = {
  id: {
    type: GraphQLID,
    description: "آیدی یکتا",
  },
  surah_id: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "شماره سوره",
  },
  order: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "ترتیب سوره",
  },
  surah_name: {
    type: GraphQLNonNull(GraphQLString),
    required: true,
    description: "نام سوره",
  },
  verse_count: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "تعداد آیه‌های سوره",
  },
  sequence_of_descent: {
    type: GraphQLNonNull(GraphQLInt),
    required: true,
    description: "ترتیب نزول سوره",
  },
  place_of_descent: {
    type: GraphQLNonNull(GraphQLString),
    required: true,
    description: "محل نزول سوره",
  },
};

const LessonType = new GraphQLObjectType({
  name: "Lesson",
  description: "اسکیمای سوره‌ها",
  fields: () => ({
    ...OBJ,
    verses: {
      type: new GraphQLList(VerseType),
      description: "لیست آیه‌های این سوره ",
      args: {
        page: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
      resolve: (parent, { page = 1, count = 10 }) => {
        return VerseModel.find({ surah_id: parent.surah_id }, null, {
          skip: (page - 1) * count,
          limit: count,
        })
          .then((result) => {
            return result;
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    verses_read: {
      type: GraphQLInt,
      description: "تعداد آیه های خوانده شده توسط کاربر",
      resolve: (parent, args, header) => {
        return LastReadModel.countDocuments({
          user_id: header.account._id,
          surah_id: parent.surah_id,
        })
          .then((result) => {
              return result;
          })
          .catch((err) => {
            return err;
          });
      },
    },
  }),
});

const Lesson2Type = new GraphQLObjectType({
  name: "Lesson2",
  description: "اسکیمای سوره‌ها",
  fields: () => ({
    ...OBJ,
  }),
});

export { LessonType, Lesson2Type };
