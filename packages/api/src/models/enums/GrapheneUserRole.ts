import { registerEnumType } from "type-graphql";

export enum GrapheneUserRole
{
    ADMIN = "ADMIN",
    USER = "USER",
}

registerEnumType(GrapheneUserRole, {
    name: "GrapheneUserRole" // this one is mandatory
});