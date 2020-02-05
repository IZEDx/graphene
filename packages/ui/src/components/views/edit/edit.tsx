import { Component, h, Prop, Event, EventEmitter, Watch, State, Listen } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneField, GrapheneEnumType } from "../../../libs/graphene";
import { pascalCase } from "change-case";

const preferredColumns = ["id", "name", "title", "url", "description"];
const readOnlyColumns = ["id", "created_at", "updated_at"];

@Component({
    tag: 'view-edit',
    //styleUrl: 'view-edit.scss',
})
export class EditView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() clearBreadcrumb: EventEmitter<void>;

    @Prop() match: MatchResults;

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @State() definition: GrapheneQueryField<GrapheneObjectType>;
    @State() entries: [string, any][];
    @State() failed = false;

    fieldMap: Record<string, GrapheneField>;

    get name()
    {
        return this.match.params["name"];
    }

    get id()
    {
        return this.match.params["id"];
    }

    @Watch("match")
    async refresh(newMatch?: MatchResults, oldMatch?: MatchResults)
    {
        if (newMatch && oldMatch && newMatch.url !== oldMatch.url) this.clearBreadcrumb.emit();
        await this.componentWillLoad();
        await this.componentDidLoad();
    }

    async componentWillLoad()
    {
        this.pushBreadcrumb.emit([this.name, this.match.url]);
        this.pushBreadcrumb.emit([this.id, this.match.url]);

        this.definition = this.graphene.getQuery(this.name)?.asObject();
        if (!this.id || !this.definition) this.failed = true;
    }

    async componentDidLoad()
    {
        if (this.failed) return;
        
        try
        {
            const object = (await this.definition.request({id: this.id}))?.[this.definition.name];
        
            this.entries = Object.entries(object)
                .sort((a, b) => {
                    const aIdx = preferredColumns.findIndex((k) => k === a[0]);
                    const bIdx = preferredColumns.findIndex((k) => k === b[0]);
    
                    if (aIdx === -1 && bIdx !== -1)
                        return 1;
                    if (aIdx !== -1 && bIdx === -1)
                        return -1;
                    if (aIdx === -1 && bIdx === -1)
                        return 0;
    
                    return aIdx > bIdx ? 1 : -1;
                });
    
            this.fieldMap = this.definition.type.getType(GrapheneObjectType)?.fieldMap;
        }
        catch(e)
        {
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

    render() 
    {

        return <segment class="segment">
            <div class="container">
                <div class="box has-blur-background">
                    { this.failed
                        ? [
                            <h1>404</h1>,
                            <p>{this.definition 
                                ? `${pascalCase(this.definition.name)} '${this.id}' not found.` 
                                : `View '${this.name}' not found.`
                            }</p>
                        ]
                        : [
                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item content">
                                        <h2>
                                            <stencil-route-link url={"/"+this.name}>
                                                &lt; Back
                                            </stencil-route-link>
                                            &nbsp;&nbsp;&nbsp;
                                            {pascalCase(this.name)}
                                        </h2>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <button class="button is-primary" onClick={() => this.onSave()}>Save</button>
                                    </div>
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
                                        disabled: readOnlyColumns.findIndex(v => v === key) > -1
                                    })
                                }) }
                            </gel-form>
                        ]
                    }
                </div>
            </div>
        </segment>;
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