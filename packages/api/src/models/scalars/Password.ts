import { GraphQLScalarType, Kind } from "graphql";

export const passwordMask = "******";

export const Password = new GraphQLScalarType(
{
    name: "Password",
    description: "Password scalar type",
    parseValue(value: string) {
        return value; // value from the client input variables
    },
    serialize(value: string) {
        return passwordMask; // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return ast.value; // value from the client query
        }
        return null;
    },
});