import { InputType, Field } from "type-graphql";
import { Password } from "../../models/scalars/Password";

@InputType()
export class LoginUserInput {
    @Field()
    name: string;

    @Field(type => Password)
    password: string;
}
