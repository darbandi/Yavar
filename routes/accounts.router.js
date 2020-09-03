import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "../controllers/account/account.schema.js";

var router = express.Router();

router.use("/", (req, res) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })(req, res);
});

export default router;
