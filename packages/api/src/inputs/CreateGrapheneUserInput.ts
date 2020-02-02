import { InputType, Field } from "type-graphql";
import { GrapheneUserRole } from "../models/enums/GrapheneUserRole";

@InputType()
export class CreateGrapheneUserInput {
    @Field()
    name: string;

    @Field()
    password: string;

    @Field(type => GrapheneUserRole)
    role: GrapheneUserRole;
}
