
import { h } from "@stencil/core";
import { GrapheneType } from "./base";
import { GraphQLObjectType, GraphQLOutputType } from "graphql";
import { GrapheneField } from "../field";
import { Graphene, maxScopes } from "../graphene";
import { GrapheneEnumType } from "./enum";

export class GrapheneObjectType extends GrapheneType<GraphQLObjectType>
{
    fields: GrapheneField<GrapheneType<GraphQLOutputType>>[]
    fieldMap: Record<string, GrapheneField<GrapheneType<GraphQLOutputType>>>

    static async create(type: GraphQLObjectType, graphene: Graphene)
    {
        const o = new GrapheneObjectType(type, graphene);
        o.fields = await GrapheneField.fromFieldMap(type.getFields(), graphene);
        o.fieldMap = o.fields.reduce((a, b) => ({...a, [b.name]: b}), {});
        return o;
    }

    toQuery(c = maxScopes)
    {
        const query = this.fields.map(f => f.toQuery(c)).join(" ");
        return query.trim().length === 0 
            ? "GRAPHENE_SKIP_FIELD!!!" 
            : `{ ${query} }\n`;
    }

    renderCell(val: any)
    {
        return this.fieldMap["name"] 
            ? this.fieldMap["name"]?.type.renderCell(val["name"])
            : "{ " + this.fields
                .map(f => f.name + ": " + f.type.renderCell(val[f.name]))
                .join(", ") + " }";
    }

    renderEdit(data: any, readonlyColumns: string[] = [])
    {
        return Object.entries(data)?.map(([key, value]) => {
            const {type, name} = this.fieldMap[key];
            const objType: GrapheneObjectType = type.getType(GrapheneObjectType);

            console.log(key, readonlyColumns);

            return objType
                ? <div class="field is-horizontal">
                    <div class="field-label is-normal">
                        <label class="label">{name.toLocaleUpperCase()}</label>
                    </div>
                    
                    <div class="field-body">
                        <div class="field">
                            <p class="control is-expanded">{objType.renderCell(value)}</p>
                        </div>
                    </div>
                </div>
                : type?.renderEdit({ 
                    formKey: key, 
                    value, 
                    label: name, 
                    options: type.getType(GrapheneEnumType)?.values,
                    disabled: readonlyColumns.findIndex(v => v === key) > -1
                });
        }) as any;
    }
}
