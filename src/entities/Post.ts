import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Post {
  @PrimaryKey()
  id!: number;

  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

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
