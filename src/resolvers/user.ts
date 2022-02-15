const argon2 = require("argon2");
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Resolver,
  ObjectType,
} from "type-graphql";

import { User } from "../entities/User";
import { MyContext } from "src/types";

@InputType()
class RegisterInput {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") { email, username, password }: RegisterInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const emailRegex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

    if (!emailRegex.test(email)) {
      return {
        errors: [
          {
            field: "email",
            message: "Incorrect email",
          },
        ],
      };
    }

    if (username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    if (password.length <= 2) {
      return {
        errors: [
          {
            field: "password",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(password);
    const user = em.create(User, {
      email,
      username,
      password: hashedPassword,
    });
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      //|| err.detail.includes("already exists"))
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username or email already taken",
            },
          ],
        };
      }
    }
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") { username, password }: RegisterInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "That username doesn't exist",
          },
        ],
      };
    }

    const verify = await argon2.verify(user.password, password);

    if (!verify) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    return { user };
  }
}
