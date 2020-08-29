const jwt = require("jsonwebtoken");
// const UserType = require("./controllers/user/user.type");
const UserModel = require("./controllers/user/user.model");

const GetUser = (header) => {
  console.log(" *************** user: ");
  return UserModel.findOne({
    _id: header.account._id,
    email: header.account.email,
    password: header.account.password,
  })
    .then((user) => {
      if (!user)
        throw new Error("توکن شما صحیح نیست. کاربری با این مشخصات یافت نشد");
      return user;
    })
    .catch((error) => {
      throw error;
    });
};

const Auth = (req, res, next) => {
  if (!req.headers.authorization) {
    res.statusCode = 401;
    res.send("401 Unauthorized");
  } else {
    const token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, "shhhhh", function (err, decoded) {
      if (err) {
        res.statusCode = 404;
        res.send("404 invalid token");
      }
      req.account = decoded;
      next();
    });
  }
};

const AccessToContent = (result, header, error) => {
  if (!result) throw new Error(error);

  if (result.user_id !== header.account._id) {
    throw new Error("شما به این محتوا دسترسی ندارید");
  }

  return result;
};

module.exports = { GetUser, Auth, AccessToContent };
