import { GrapheneType } from "./base";
import { GraphQLOutputType } from "graphql";
import { Graphene, maxScopes } from "../graphene";

export class GrapheneListType<T extends GrapheneType = GrapheneType> extends GrapheneType<GraphQLOutputType>
{
    ofType: T;

    static async create<T extends GrapheneType = GrapheneType>(type: GraphQLOutputType, graphene: Graphene)
    {
        const o = new GrapheneListType<T>(type as any, graphene);
        o.ofType = await GrapheneType.create(type["ofType"], graphene) as any;
        return o;
    }

    toQuery(c = maxScopes)
    {
        return this.ofType.toQuery(c);
    }

    renderCell(val: any)
    {
        return "[ " + val
                .map(v => this.ofType.renderCell(v))
                .join(", ") + " ]";
    }

    renderEdit(val: any)
    {
        return `Edit List(${this.ofType.renderEdit(val)})`;
    }
}
