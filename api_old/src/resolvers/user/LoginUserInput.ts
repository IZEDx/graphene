import { InputType, Field } from "type-graphql";
import { Password } from "../../models/scalars/Password";
import { Length } from "class-validator";

@InputType()
export class LoginUserInput {
    @Field()
    @Length(3, 12)
    name: string;

    @Field(type => Password)
    password: string;
}
