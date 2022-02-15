import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType() //typing for graphql
@Entity()
export class User {
  @Field(() => Int) //typing for graphql
  @PrimaryKey()
  id!: number;

  @Field(() => String) //typing for graphql
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String) //typing for graphql
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field() //typing for graphql
  @Property({ type: "text", unique: true })
  username!: string;

  @Field() //typing for graphql
  @Property({ type: "text", unique: true })
  email!: string;

  // we dont want this data in graphql - only for DB
  @Property({ type: "text" })
  password!: string;
}
