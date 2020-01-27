import {GraphQLClient} from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

export class API<Responses extends Record<string, any>, Queries extends Record<keyof Responses, string>>
{
    public client: GraphQLClient;

    constructor(public url: string, token: string, public queries: Queries) {
        this.client = new GraphQLClient(url, {
            headers: !token ? {} : {
                Authorization: `Bearer ${token}`,
            },
        })

    }

    query<K extends keyof (Queries|Responses)>(query: K, variables?: Variables)
    {
        return this.client.request<Responses[K]>(this.queries[query], variables);
    }
}
