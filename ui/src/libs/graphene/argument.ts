import { GrapheneType } from "./types/base";
import { GraphQLOutputType, GraphQLArgument } from "graphql";
import { Graphene } from "./graphene";

export class GrapheneArgument<
    T extends GrapheneType<GraphQLOutputType> = GrapheneType<GraphQLOutputType>
>
{
    name: string;
    type: T;
    description: string;
    defaultValue: any;

    private constructor(public _arg: GraphQLArgument, public graphene: Graphene)
    {
        this.name = _arg.name;
        this.description = _arg.description;
        this.defaultValue = _arg.defaultValue;
    }

    static async create(arg: GraphQLArgument, graphene: Graphene)
    {
        const result = new GrapheneArgument(arg, graphene);
        result.type = await GrapheneType.create(arg.type, graphene);
        return result;
    }

}