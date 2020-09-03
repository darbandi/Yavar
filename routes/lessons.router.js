import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "../controllers/lesson/lesson.schema.js";
import { Auth } from "../Utils.js";

var router = express.Router();

router.use("/", Auth);

router.use("/", (req, res) => {
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })(req, res);
});

export default router;
