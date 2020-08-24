var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var schema = require("../controllers/user/user.schema.js");
const jwt = require("jsonwebtoken");

var router = express.Router();

router.use("/", (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(token, "shhhhh", function (err, decoded) {
    if (err) throw err;
    next();
  });
});

router.use("/", (req, res) => {
   graphqlHTTP({
     schema: schema,
     graphiql: true,
   })(req, res);
});

module.exports = router;
