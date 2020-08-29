const graphql = require("graphql");
const AccountModel = require("./../user/user.model");
const AccountType = require("./../user/user.type");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} = graphql;

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
        validAccount = account;
        return bcrypt.compare(password, account.password);
      })
      .then((result) => {
        if (!result) throw new Error("uset or password is invalid");
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

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
