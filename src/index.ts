import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
// import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  const orm = await MikroORM.init(microConfig);

  // migration: yarn mikro-orm migration:create
  // yarn start2
  await orm.getMigrator().up();

  // const post = orm.em.create(Post, { title: "second post" }); // create NEW post
  // await orm.em.persistAndFlush(post); // push post into DB

  const posts = await orm.em.find(Post, {}); // show me ALL posts in DB
  console.log(posts);
};

main().catch((err) => {
  console.error(err);
});
