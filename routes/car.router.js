var express = require("express");
const { graphqlHTTP } = require("express-graphql");
var schema = require("../controllers/car/car.schema.js");

var router = express.Router();

router.use(
  "/",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

module.exports = router;