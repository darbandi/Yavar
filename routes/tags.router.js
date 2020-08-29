var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var schema = require("../controllers/tag/tag.schema.js");
const { Auth } = require("../Utils.js");

var router = express.Router();

router.use("/", Auth);

router.use("/", (req, res) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })(req, res);
});

module.exports = router;
