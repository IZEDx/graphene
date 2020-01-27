import { Component, h, Prop, Event, EventEmitter, Watch, State } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene, GraphQLObjects } from "../../../global/context";
import { GraphQLSchema, GraphQLObjectType, GraphQLScalarType, GraphQLField, GraphQLUnionType, GraphQLList, GraphQLOutputType, GraphQLNonNull } from "graphql";
import { pascalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";

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
    @graphene.Context("schema") schema: GraphQLSchema;
    @graphene.Context("objects") objects: GraphQLObjects;

    @State() type: GraphQLObjectType;
    @State() object: Record<string, any>;

    get name()
    {
        return this.match.params["name"];
    }

    get id()
    {
        return this.match.params["id"];
    }

    @Watch("match")
    async componentWillLoad(newMatch?: MatchResults, oldMatch?: MatchResults)
    {
        if (newMatch && oldMatch && newMatch.url !== oldMatch.url) this.clearBreadcrumb.emit();
        this.pushBreadcrumb.emit([this.name, this.match.url]);
        this.pushBreadcrumb.emit([this.id, this.match.url]);

        const name = Object.keys(this.objects).find(k => this.name.toLowerCase().startsWith(k.toLowerCase()));
        const object = this.objects[name];
        this.type = object.type as GraphQLObjectType;

        const request = `{
            ${name}(id: ${this.id}) {
                ${this.queryFields(this.type)}
            }
        }`;

        this.object = (await this.api.client.request(request)).page;
        console.log(this.object);

    }

    render()
    {
        return <segment class="segment">
            <div class="container">
                <div class="level">
                    <div class="level-left">
                        <div class="level-item content">
                            <h1>
                                <stencil-route-link url={"/"+this.name}>
                                    &lt; Back
                                </stencil-route-link>
                            </h1>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <button class="button is-primary">Save</button>
                        </div>
                    </div>
                </div>
                { Object.entries(this.object)
                    .map(([key, val]) => this.renderField(key, val))
                }
            </div>
        </segment>;
    }

    renderField(key: string, val: any)
    {
        return (
            <div class="field is-horizontal">
                <div class="field-label is-normal">
                    <label class="label">{key.toLocaleUpperCase()}</label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <p class="control is-expanded">
                            { this.renderValue(key, val) }
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    renderValue(key: string, val: any)
    {
        const field = this.type.getFields()[key];
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
}