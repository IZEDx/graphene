
import { h } from "@stencil/core";
import { GraphQLScalarType } from "graphql";
import { Graphene } from "../graphene";
import { GrapheneType } from "./base";


export type GrapheneScalarTypeNames = "DateTime"|"Boolean"|"ID"|"String";
export class GrapheneScalarType extends GrapheneType<GraphQLScalarType>
{
    static async create(type: GraphQLScalarType, graphene: Graphene)
    {
        return new GrapheneScalarType(type, type.name as any, graphene);
    }

    protected constructor(private type: GraphQLScalarType, public name: GrapheneScalarTypeNames, graphene: Graphene)
    { super(type, graphene); }

    toQuery()
    {
        return "";
    }

    renderCell(val: any)
    {
        switch(this.name)
        {
            case "DateTime": return new Date(val).toLocaleString();
            case "Boolean": return val === "true" ? <ion-icon name="checkbox-outline"></ion-icon> : <ion-icon name="square-outline"></ion-icon>;
            case "ID": return ""+val;
            case "String": return ""+val;
            default: 
                const renderer = this.graphene.cellRenderers[this.type.name];
                if (renderer) return renderer(val);
                else return ""+val;
        }
    }

    renderEdit(props: any)
    {
        switch (this.type.name)
        {
            case "DateTime": return <gel-input-text {...props} key={props.key}></gel-input-text>;
            case "Boolean": return <gel-input-switch {...props} key={props.key}></gel-input-switch>;
            case "Password": return <gel-input-text {...props} key={props.key} type="password" autoComplete="new-password"></gel-input-text>;
            default: 
                const renderer = this.graphene.inputRenderers[this.type.name];
                if (renderer) return renderer(props);
                else return <gel-input-text {...props} key={props.key}></gel-input-text>;
        }

    }
}
