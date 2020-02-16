import { InputType, Field } from "type-graphql";
import { UserRole } from "../../models/enums/UserRole";
import { Password } from "../../models/scalars/Password";

@InputType()
export class EditUserInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field(type => Password)
    password: string;

    @Field(type => UserRole)
    role: UserRole;
}
