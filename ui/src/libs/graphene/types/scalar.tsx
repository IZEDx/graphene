
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
            case "Boolean": return val === true || val === "true" 
                ? <ion-icon name="checkbox-outline"></ion-icon> 
                : <ion-icon name="square-outline"></ion-icon>;
            default: 
                const renderer = this.graphene.cellRenderers[this.type.name];
                if (renderer) return renderer(val);
                else if (typeof val === "string" && val.length > 32) return ""+val.substr(0, 32)+"...";
                else return ""+val;
        }
    }

    renderEdit(props: any)
    {
        switch (this.type.name)
        {
            case "DateTime": return <gel-input-text {...props} key={props.key}></gel-input-text>;
            case "Boolean": return <gel-input-switch {...props} key={props.key}></gel-input-switch>;
            case "RichContent": return <gel-input-rich {...props} key={props.key}></gel-input-rich>;
            case "Password": return <gel-input-text {...props} key={props.key} type="password" autoComplete="new-password"></gel-input-text>;
            default: 
                const renderer = this.graphene.inputRenderers[this.type.name];
                if (renderer) return renderer(props);
                else return <gel-input-text {...props} key={props.key}></gel-input-text>;
        }

    }
}
