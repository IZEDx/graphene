import { Graphene, maxScopes } from "../graphene";
import { GrapheneType } from "./base";
import { GraphQLNonNull, GraphQLOutputType } from "graphql";

export class GrapheneNonNullType<T extends GrapheneType = GrapheneType> extends GrapheneType<GraphQLOutputType>
{
    ofType: T;
    
    static async create(type: GraphQLNonNull<any>, graphene: Graphene)
    {
        const o = new GrapheneNonNullType(type, graphene);
        o.ofType = await GrapheneType.create(type.ofType, graphene) as any;
        return o;
    } 

    toQuery(c = maxScopes)
    {
        return this.ofType?.toQuery(c) ?? "";
    }

    renderCell(val: any)
    {
        return this.ofType?.renderCell(val) ?? "";
    }

    renderEdit(val: any)
    {
        return this.ofType.renderEdit(val);
    }
}
