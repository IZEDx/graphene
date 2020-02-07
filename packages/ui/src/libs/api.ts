import {GraphQLClient} from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

export class API<Responses extends Record<string, any>, Queries extends Record<keyof Responses, string>>
{
    public client: GraphQLClient;

    constructor(public url: string, public queries: Queries, token?: string) 
    {
        this.setToken(token);
    }

    setToken(token?: string)
    {
        const headers  = !token || token === "undefined" ? {} : {
            Authorization: `Bearer ${token}`,
        };

        console.log(typeof token, headers);
        this.client = new GraphQLClient(this.url, {headers})
    }

    query<K extends keyof (Queries|Responses)>(query: K, variables?: Variables)
    {
        return this.client.request<Responses[K]>(this.queries[query], variables);
    }
}
