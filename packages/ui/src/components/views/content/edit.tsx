import { Component, h, Prop, State, Listen } from "@stencil/core";
import { graphene, content } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneField, GrapheneEnumType, GrapheneListType } from "../../../libs/graphene";
import { pascalCase } from "change-case";

@Component({
    tag: 'content-edit',
    //styleUrl: 'view-edit.scss',
})
export class ContentEdit 
{
    @Prop() params: Record<string, string|number>|undefined;
    @Prop() preferredColumns: string[] = [];
    @Prop() readonlyColumns: string[] = [];

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @content.Context("definition") definition: GrapheneQueryField<GrapheneObjectType>;
    @content.Context("listDef") listDef: GrapheneQueryField<GrapheneListType>;
    @content.Context("canEdit") canEdit: boolean;
    @content.Context("canDelete") canDelete: boolean;
    @content.Context("isList") isList: boolean;

    @State() entries: [string, any][];
    @State() failed = false;

    fieldMap: Record<string, GrapheneField>;

    @content.Observe("definition")
    async componentWillLoad()
    {
        console.log(this);
        try
        {
            const object = (await this.definition.request(this.params))?.[this.definition.name];
        

            this.entries = Object.entries(object)
                .sort((a, b) => {
                    const aIdx = this.preferredColumns.findIndex((k) => k === a[0]);
                    const bIdx = this.preferredColumns.findIndex((k) => k === b[0]);
    
                    if (aIdx === -1 && bIdx !== -1)
                        return 1;
                    if (aIdx !== -1 && bIdx === -1)
                        return -1;
                    if (aIdx === -1 && bIdx === -1)
                        return 0;
    
                    return aIdx > bIdx ? 1 : -1;
                });
    
            this.fieldMap = this.definition.type.getType(GrapheneObjectType)?.fieldMap;
            this.failed = false;
        }
        catch(e)
        {
            console.error(e);
            this.failed = true;
        }
        
    }

    @Listen("inputUpdate")
    onInputUpdate(e: CustomEvent<{formKey: string, value: string}>)
    {
        const entry = this.entries.find(([k]) => k === e.detail.formKey);
        entry[1] = e.detail.value;
        this.entries = this.entries;
        console.log("Form Update", this.entries);
    }

    async onSave()
    {
        const result = await this.definition.edit(this.entries.reduce((a, [k,v]) => ({...a, [k]: v}), {}));
        console.log(result);
    }

    get title()
    {
        if (this.params?.id)
        {
            const entry = this.entries.find(([k]) => k === "name" || k === "title");
            console.log(entry, this.entries);
            if (entry) return this.fieldMap[entry[0]].type.renderCell(entry[1]);

            return `${pascalCase(this.definition.name)} (${this.params.id})`;
        }
        return pascalCase(this.definition.name);
    }

    render() 
    {

        return this.failed ? "Something went wrong" : [
            <div class="level is-mobile">
                <div class="level-left">
                    { !this.isList ? "" :
                        <div class="level-item">
                            <stencil-route-link url={"/"+this.listDef.name}>
                                <button class="button is-outlined">
                                    <ion-icon name="return-left"></ion-icon>
                                </button>
                            </stencil-route-link>
                        </div>
                    }
                    
                    <div class="level-item">
                        <p class="subtitle is-5">
                            <strong>{this.title}</strong>
                        </p>
                    </div>
                </div>
                <div class="level-right">
                    { !this.canDelete ? "" : 
                        <div class="level-item">
                            <button class="button is-danger" onClick={() => this.onSave()}>
                                Delete &nbsp; <ion-icon name="trash"></ion-icon>
                            </button>
                        </div>
                    }
                    { !this.canEdit ? "" : 
                        <div class="level-item">
                            <button class="button is-success" onClick={() => this.onSave()}>
                                Save &nbsp; <ion-icon name="save"></ion-icon>
                            </button>
                        </div>
                    }
                </div>
            </div>,
            <gel-form>
                { this.entries?.map(([key, value]) => {
                    const {type, name} = this.fieldMap[key];
                    return type?.renderEdit({ 
                        formKey: key, 
                        value, 
                        label: name, 
                        options: type.getType(GrapheneEnumType)?.values,
                        disabled: this.readonlyColumns.findIndex(v => v === key) > -1
                    })
                }) }
            </gel-form>
        ];
    }

    /*

    renderField(key: string, val: any)
    {
        const field = this.definition.type.fieldMap[key];
        return (
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">{key.toLocaleUpperCase()}</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <p class="control is-expanded">
                            { field.type.renderEdit(val) }
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    renderValue(key: string, val: any)
    {
        const field = this.definition.type.fieldMap[key];
        const type = field.type?.["ofType"] ?? field.type;

        switch (type.name)
        {
            case "String":
                return <input class="input" type="text" value={val}></input>;
            case "DateTime":
                const disabled = key === "created_at" || key === "updated_at";
                const date = new Date(val);
                const day = ("0" + date.getDate()).slice(-2);
                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                const hour = ("0" + date.getHours()).slice(-2);
                const minute = ("0" + date.getMinutes()).slice(-2);
                console.log(date);
                const str = date.getFullYear()+"-"+month+"-"+day+"T"+hour+":"+minute;
                console.log(str);
                return <input class="input" type="datetime-local" disabled={disabled} value={str}></input>;
            case "Boolean":
                return ""+val;
            default: 
                return ""+val;
        }
    }

    queryFields(t: GraphQLObjectType, c = 3)
    {
        return Object.entries(t.getFields())
            .map(([k, f]) => this.queryType(k, f.type, c))
            .filter(s => s !== undefined)
            .join(" ");
    }

    queryType(key: string, type: GraphQLOutputType, c = 3): string|undefined
    {
        if (type instanceof GraphQLScalarType)
        {
            return key;
        }

        else if (type instanceof GraphQLNonNull)
        {
            return this.queryType(key, type.ofType, c);
        }

        else if (type instanceof GraphQLUnionType)
        {
            return `${key} { 
                ${type.getTypes().map(type => this.queryType("... on "+type.name, type, c)).join("\n")}
            }`;
        }

        else if (c <= 0) return undefined;

        else if (type instanceof GraphQLList)
        {
            return this.queryType(key, type.ofType, c);
        }

        else if (type instanceof GraphQLObjectType)
        {
            return `${key} { 
                __typename
                ${this.queryFields(type, c - 1)}
            }`;
        }

        return undefined;
    }

    typeOf<T>(t: any, c: {new(...args: any[]): T}): t is T
    {
        return t instanceof c || t?.["ofType"] instanceof c;
    }
    */
}