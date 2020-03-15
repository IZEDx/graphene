import { GrapheneType } from "./base";
import { GraphQLEnumType, GraphQLEnumValue } from "graphql";
import { Graphene, maxScopes } from "../graphene";
import { h } from "@stencil/core";

export class GrapheneEnumType extends GrapheneType<GraphQLEnumType>
{
    values: GraphQLEnumValue[];

    static async create(type: GraphQLEnumType, graphene: Graphene)
    {
        const o = new GrapheneEnumType(type as any, graphene);
        o.values = type.getValues();
        return o;
    } 

    toQuery(_c = maxScopes)
    { 
        return "";
    }

    renderCell(_val: any)
    {
        return "" + (this.values.find(v => v.value === _val)?.name ?? _val);
    }

    renderEdit(props: any)
    {
        return <gel-input-select {...props}></gel-input-select>
    }
}
