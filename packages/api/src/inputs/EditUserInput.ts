import { InputType, Field } from "type-graphql";
import { UserRole } from "../models/enums/UserRole";

@InputType()
export class EditUserInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    password: string;

    @Field(type => UserRole)
    role: UserRole;
}
