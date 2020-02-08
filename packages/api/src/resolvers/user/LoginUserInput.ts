import { InputType, Field } from "type-graphql";

@InputType()
export class LoginUserInput {
    @Field()
    name: string;

    @Field()
    password: string;
}
