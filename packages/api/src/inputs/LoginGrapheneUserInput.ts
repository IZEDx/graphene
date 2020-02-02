import { InputType, Field } from "type-graphql";

@InputType()
export class LoginGrapheneUserInput {
    @Field()
    name: string;

    @Field()
    password: string;
}
