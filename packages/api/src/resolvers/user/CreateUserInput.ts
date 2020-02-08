import { InputType, Field } from "type-graphql";
import { UserRole } from "../../models/enums/UserRole";

@InputType()
export class CreateUserInput {
    @Field()
    name: string;

    @Field()
    password: string;

    @Field(type => UserRole)
    role: UserRole;
}
