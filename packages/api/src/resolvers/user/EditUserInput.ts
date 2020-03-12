import { InputType, Field } from "type-graphql";
import { UserRole } from "../../models/enums/UserRole";
import { Password } from "../../models/scalars/Password";
import { Length, Validate } from "class-validator";
import { SafePassword } from "../../validators/SafePassword";

@InputType()
export class EditUserInput {
    @Field()
    id: string;

    @Field()
    @Length(3, 12)
    name: string;

    @Field(type => Password)
    @Validate(SafePassword)
    password: string;

    @Field(type => UserRole)
    role: UserRole;
}
