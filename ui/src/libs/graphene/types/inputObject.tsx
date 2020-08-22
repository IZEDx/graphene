import { GrapheneField } from "../field";
import { GraphQLInputType } from "graphql";
import { Graphene } from "../graphene";
import { GrapheneType } from "./base";
import { GrapheneEnumType } from "./enum";
import { GrapheneObjectType } from "./object";
import { h } from "@stencil/core";

export class GrapheneInputObjectType extends GrapheneType
{
    fields: GrapheneField[] = [];
    fieldMap: Record<string, GrapheneField>;
    
    static async create(type: GraphQLInputType, graphene: Graphene)
    {
        const o = new GrapheneInputObjectType(type as any, graphene);
        o.fields = await GrapheneField.fromFieldMap(type["getFields"]() as any, graphene);
        o.fieldMap = o.fields.reduce((a, b) => ({...a, [b.name]: b}), {});
        return o;
    } 

    toQuery()
    {
        return "";
    }

    toArgument(data: any)
    {

        const values = Object.entries(data)
            .filter(([k]) => this.fieldMap[k] !== undefined)
            .map(([k, v]) => {
                const field = this.fieldMap[k];
                console.log("lol field", field, field.isEnum());
                //const scalar = field.type.getType(GrapheneScalarType);
                let isString = !field.type.getType(GrapheneEnumType) && typeof v !== "number" && typeof v !== "boolean";
                return `${k}: ${isString ? `"${v}"` : v}`;
            });

        return `{ ${values.join(", ")} }`
    }

    renderCell(val: any)
    {
        return "{ " + this.fields
                .map(f => f.name + ": " + f.type.renderCell(val[f.name]))
                .join(", ") + " }";
    }

    /*
    renderEdit(entries: any, readonlyColumns: string[] = [])
    {
        console.log("renderEdit", entries, readonlyColumns);
        return entries?.map(([key, value]) => {
            const {type, name} = this.fieldMap[key];

            return (type?.renderEdit as any)({ 
                formKey: key, 
                value, 
                label: name, 
                options: type.getType(GrapheneEnumType)?.values,
                disabled: readonlyColumns.findIndex(v => v === key) > -1
            }, (type.isInputObject() || type.isObject()) ? readonlyColumns : undefined)
        })
    }
    */

    renderEdit(data: any, readonlyColumns: string[] = [])
    {
        console.log("EDIT READONLY ", readonlyColumns);
        console.log("EDIT DATA", data);

        return Object.entries(data)
        .filter(([key]) => !!this.fieldMap[key])
        .map(([key, value]) => {

            console.log(key, this.fieldMap);

            const {type, name} = this.fieldMap[key];
            const objType: GrapheneObjectType = type.getType(GrapheneObjectType);

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
