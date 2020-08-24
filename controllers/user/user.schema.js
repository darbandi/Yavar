const graphql = require("graphql");
const UserModel = require("./user.model");
const bcrypt = require("bcryptjs");
const UserType = require("./user.type");
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
 * login
 */
const login = {
  type: GraphQLString,
  args: {
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
  },
  resolve: (parent, { email, password }, req) => {
    const token = jwt.sign({ email, password }, "shhhhh", { expiresIn: "2h" });
    return "Bearer " + token;
  },
};

/**
 * get one user
 */
const user = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }) => {
    return UserModel.findById(id)
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
 * get users list
 */
const users = {
  type: new GraphQLList(UserType),
  args: {
    email: { type: GraphQLString },
    page: { type: GraphQLInt },
    count: { type: GraphQLInt },
  },
  resolve: (parent, { email, page, count }, header) => {
    console.log("header : ", header);
    // jwt.verify(token, "shhhhh", function (err, decoded) {
    //   console.log(decoded);
    // });
    if (email) {
      return UserModel.find({
        email: email,
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
      return UserModel.find(null, null, {
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
 * get total count of users
 */
const usersCount = {
  type: GraphQLInt,
  args: {},
  resolve: (parent) => {
    return UserModel.countDocuments({})
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * add one user
 */
const addUser = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: (parent, { email, password }) => {
    console.log("email, password : ", email, password);
    return bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new UserModel({
          email: email,
          password: hashedPassword,
        });
        console.log("user : ", user);
        return user.save();
      })
      .then((user) => {
        return user;
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * update one user
 */
const updateUser = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  resolve: (parent, { key, id, password }) => {
    return UserModel.findByIdAndUpdate(id)
      .then((user) => {
        if (email) user.email = email;
        if (password) user.password = password;
        return user.save();
      })
      .catch((err) => {
        throw err;
      });
  },
};

/**
 * delete user
 */
const deleteUser = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },
  resolve: (parent, { id }) => {
    //   return UserModel.deleteMany();
    return UserModel.findById(id)
      .then((user) => {
        if (!user) return new Error(`id ${id} not found`);
        return user.deleteOne();
      })
      .catch((err) => {
        throw err;
      });
  },
};

const Query = new GraphQLObjectType({
  name: "QueryType",
  fields: {
    login,
    user,
    users,
    usersCount,
  },
});

const Mutation = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    addUser,
    updateUser,
    deleteUser,
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
