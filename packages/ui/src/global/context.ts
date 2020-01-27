import { Entanglement, qt } from "stencil-quantum";
import { GrapheneAPI } from "./api";
import { GraphQLSchema, GraphQLFieldMap, GraphQLObjectType } from "graphql";

export type GraphQLObjects = GraphQLFieldMap<any, any, Record<string, GraphQLObjectType>>;

export const graphene = new Entanglement({
    api: qt<GrapheneAPI>(),
    schema: qt<GraphQLSchema>(),
    objects: qt<GraphQLObjects>(),
    connected: qt<boolean>({default: false})
});

export const nav = new Entanglement({
    isExpanded: qt<boolean>({default: false})
})