import { Component, h, Prop, State, Event, EventEmitter, Watch } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene, GraphQLObjects } from "../../../global/context";
import { GraphQLSchema, GraphQLField, GraphQLScalarType, GraphQLList } from "graphql";
import { pascalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";

const preferredColumns = ["id", "name", "title", "url", "description"];
const preferredEndCols = ["created_at", "updated_at"];

@Component({
    tag: 'view-list',
    //styleUrl: 'view-list.scss',
})
export class ListView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() popBreadcrumb: EventEmitter<void>;

    @Prop() match: MatchResults;
    @Prop() columnCount = 8;

    @State() object: GraphQLField<any, any>;
    @State() fields: GraphQLObjects;
    @State() columns: string[];
    @State() rows: any[];

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("schema") schema: GraphQLSchema;
    @graphene.Context("objects") objects: GraphQLObjects;

    @Watch("match")
    async componentWillLoad(newMatch?: MatchResults, oldMatch?: MatchResults)
    {
        if (newMatch && oldMatch && newMatch.url !== oldMatch.url) this.popBreadcrumb.emit();
        const name = this.match.params["name"];
        this.object = this.objects?.[name];
        this.pushBreadcrumb.emit([name, this.match.url]);

        const type = this.object.type as GraphQLList<any>;
        this.fields = type.ofType.getFields();
        
        const preferred = preferredColumns.filter(s => this.fields[s] !== undefined);
        const preferredEnd = preferredEndCols.filter(s => this.fields[s] !== undefined);
        const rest = Object.keys(this.fields).filter(s => !preferred.includes(s) && !preferredEnd.includes(s));

        this.columns = [
            ...preferred, 
            ...rest.slice(0, this.columnCount - preferred.length - preferredEnd.length),
            ...preferredEnd
        ].filter(col => this.fields?.[col].type instanceof GraphQLScalarType || this.fields?.[col].type?.["ofType"] instanceof GraphQLScalarType)


        const request = `{
            ${name} {
                ${this.columns.join(" ")}
            }
        }`;
        this.rows = (await this.api.client.request(request))[name];

        for (const row of this.rows)
        {
            for (const [col, val] of Object.entries(row))
            {
                const type = this.fields[col].type?.["ofType"] ?? this.fields[col].type;

                row[col] = () => this.renderCell(val, type);
            }
        }
    }

    render()
    {

        return <segment class="segment">
            <div class="container">
                <div class="content">
                    <h1>{pascalCase(this.object.name)}</h1>
                    <p>{ this.object.description }</p>
                    <br />
                    <gel-table columns={this.columns} rows={this.rows}></gel-table>
                </div>
            </div>
        </segment>;
    }

    renderCell(val: any, type: GraphQLScalarType)
    {
        switch(type.name)
        {
            case "DateTime": return new Date(val).toLocaleString();
            case "Boolean": return ""+val;
            case "ID": return ""+val;
            case "String": return ""+val;
            default: return ""+val;
        }
    }
}