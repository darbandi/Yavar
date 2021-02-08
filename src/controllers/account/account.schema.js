import { GraphQLObjectType, GraphQLString, GraphQLSchema } from "graphql";
import AccountModel from "./../user/user.model";
import AccountType from "./../user/user.type";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * login
 */
const login = {
  type: GraphQLString,
  description: "ورود",
  args: {
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  resolve: (parent, { email, password }, header) => {
    let validAccount = null;
    return AccountModel.findOne({ email })
      .then((account) => {
        if (!account) throw new Error("اطلاعات وارد شده صحیح نیست");
        validAccount = account;
        return bcrypt.compare(password, account.password);
      })
      .then((result) => {
        // result is boolean
        if (!result) throw new Error("اطلاعات وارد شده صحیح نیست");
        const token = jwt.sign({ ...validAccount._doc }, "shhhhh", {
          expiresIn: "100h",
        });
        return "Bearer " + token;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * register account
 */
const register = {
  type: AccountType,
  description: "ثبت نام",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: (parent, { email, password }, header) => {
    return AccountModel.findOne({ email })
      .then((user) => {
        if (user) {
          throw new Error(
            "از این ایمیل قبلا استفاده شده است. لطفا با ایمیل دیگری ثبت نام نمایید"
          );
        }
        return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
        const account = new AccountModel({
          email: email,
          password: hashedPassword,
        });
        return account.save();
      })
      .then((account) => {
        return account;
      })
      .catch((err) => {
        throw err;
      });
  },
};

const Query = new GraphQLObjectType({
  name: "Query",
  description: "ورود کاربران",
  fields: {
    login,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "ثبت نام کاربران",
  fields: {
    register,
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
