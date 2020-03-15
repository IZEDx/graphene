import { GraphQLUnionType } from "graphql";
import { Graphene, maxScopes } from "../graphene";
import { GrapheneObjectType } from "./object";
import { GrapheneType } from "./base";
 
export class GrapheneUnionType extends GrapheneType<GraphQLUnionType>
{
    types: GrapheneObjectType[] = [];
    
    static async create(type: GraphQLUnionType, graphene: Graphene)
    {
        const o = new GrapheneUnionType(type, graphene);
        for (const t of type.getTypes())
        {
            o.types.push(await GrapheneType.create(t, graphene) as any)
        }

        return o;
    } 

    toQuery(c = maxScopes)
    {
        console.log("toQuery Union", this);
        const query = this.types
            .map(type => ([type.name, type.toQuery(c)]))
            .filter(([_, query]) => {
                return query && query.trim().length > 2 && query.slice(1, query.length - 2).trim().length > 0
            })
            .map(([name, query]) => `... on ${name} ${query}` ).join(" ");
        return query ? "{ " + query + " }" : "GRAPHENE_SKIP_FIELD!!!";
    }

    renderCell(val: any)
    {
        return this.types[0]?.renderCell(val) ?? "null";
    }

    renderEdit(val: any)
    {
        return `Edit Union(${this.types.map(t => t.renderEdit(val)).join("|")})`;
    }
}
