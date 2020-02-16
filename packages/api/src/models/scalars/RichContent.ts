import { GraphQLScalarType, Kind } from "graphql";

export const RichContent = new GraphQLScalarType(
{
    name: "RichContent",
    description: "RichContent scalar type",
    parseValue(value: string) {
        return value; // value from the client input variables
    },
    serialize(value: string) {
        return value; // value sent to the client
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return ast.value; // value from the client query
        }
        return null;
    },
});