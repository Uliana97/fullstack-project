import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostsResolver } from "./resolvers/posts";

const main = async () => {
  const orm = await MikroORM.init(microConfig);

  // migration: yarn mikro-orm migration:create
  // yarn start2
  await orm.getMigrator().up();

  // define express server
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostsResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  // creates graphql endpoind
  apolloServer.applyMiddleware({ app });

  // start server on port 4000
  app.listen(4000, () => {
    console.log("server started at post 4000");
  });
};

main().catch((err) => {
  console.error(err);
});
