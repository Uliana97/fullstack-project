import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType() //typing
@Entity()
export class Post {
  @Field(() => Int) //typing
  @PrimaryKey()
  id!: number;

  @Field(() => String) //typing
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String) //typing
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field() //typing
  @Property({ type: "text" })
  title!: string;
}

// RETURNS THIS IN DB (example)
// Post {
//   id: 1,
//   createdAt: 2022-02-11T17:31:07.000Z,
//   updatedAt: 2022-02-11T17:31:07.000Z,
//   title: 'my first post'
// }
