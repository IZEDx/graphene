import { GrapheneListType } from "./types/list";
import { GrapheneObjectType } from "./types/object";
import { GrapheneScalarType } from "./types/scalar";
import { GrapheneNonNullType } from "./types/nonnull";
import { GrapheneUnionType } from "./types/union";
import { GrapheneInputObjectType } from "./types/inputObject";
import { GrapheneEnumType } from "./types/enum";
import { GrapheneType } from "./types/base";
import { GraphQLOutputType, GraphQLInputType, GraphQLList, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType, GraphQLInputObjectType, GraphQLEnumType, GraphQLNonNull } from "graphql";

export type Kind = "LIST"|"OBJECT"|"INPUT_OBJECT"|"SCALAR"|"NONNULL"|"UNION"|"UNKNOWN"|"ENUM"; 

export const kindMap = {
    LIST: GrapheneListType,
    OBJECT: GrapheneObjectType,
    SCALAR: GrapheneScalarType,
    NONNULL: GrapheneNonNullType,
    UNION: GrapheneUnionType,
    INPUT_OBJECT: GrapheneInputObjectType,
    ENUM: GrapheneEnumType,
    UNKNOWN: GrapheneType
}

export function getKind(type: GraphQLOutputType|GraphQLInputType): Kind
{
    if (type instanceof GraphQLList) return "LIST";
    if (type instanceof GraphQLObjectType) return "OBJECT";
    if (type instanceof GraphQLScalarType) return "SCALAR";
    if (type instanceof GraphQLNonNull) return "NONNULL";
    if (type instanceof GraphQLUnionType) return "UNION";
    if (type instanceof GraphQLInputObjectType) return "INPUT_OBJECT";
    if (type instanceof GraphQLEnumType) return "ENUM";

    return "UNKNOWN";
}