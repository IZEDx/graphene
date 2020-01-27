import { API } from "../libs/api";
import { IntrospectionQuery, introspectionQuery } from "graphql";

export interface APIResponses extends Record<string, any>
{
    "introspect": IntrospectionQuery
}

export const APIQueries =
{
    "introspect": introspectionQuery
}

export type GrapheneAPI = API<APIResponses, typeof APIQueries>;