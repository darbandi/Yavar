var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var schema = require("../controllers/user/user.schema.js");
const jwt = require("jsonwebtoken");

var router = express.Router();

// router.use("/", (req, res, next) => {
//   if (!req.headers.authorization) {
//     res.statusCode = 401;
//     res.send("401 Unauthorized");
//   } else {
//     const token = req.headers.authorization.replace("Bearer ", "");
//     jwt.verify(token, "shhhhh", function (err, decoded) {
//       if (err) {
//           res.statusCode = 404;
//           res.send("404 invalid token");
//       }
//       req.decoded = decoded;
//       next();
//     });
//   }
// });

router.use("/", (req, res) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })(req, res);
});

module.exports = router;
