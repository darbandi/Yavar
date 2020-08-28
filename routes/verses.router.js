var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var schema = require("../controllers/verse/verse.schema.js");

var router = express.Router();

router.use("/", (req, res) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })(req, res);
});

module.exports = router;
