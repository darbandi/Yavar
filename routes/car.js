var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var schema = require("../schemas/car/car.schema.js");

var router = express.Router();

router.get(
  "/",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

module.exports = router;
