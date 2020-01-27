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
    @Event() clearBreadcrumb: EventEmitter<void>;

    @Prop() match: MatchResults;
    @Prop() columnCount = 8;

    @State() object: GraphQLField<any, any>;
    @State() fields: GraphQLObjects;
    @State() columns: string[];
    @State() rows: any[] = [];
    @State() values: any[] = [];

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("schema") schema: GraphQLSchema;
    @graphene.Context("objects") objects: GraphQLObjects;

    @Watch("match")
    async componentWillLoad()
    {
        this.clearBreadcrumb.emit();
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


        this.rows = [];
        const request = `{
            ${name} {
                ${this.columns.join(" ")}
            }
        }`;
        this.values = (await this.api.client.request(request))[name];

        for (const idx in this.values)
        {
            for (const [col, val] of Object.entries(this.values[idx]))
            {
                const type = this.fields[col].type?.["ofType"] ?? this.fields[col].type;

                this.rows[idx] = this.rows[idx] ?? {};
                this.rows[idx][col] = () => this.renderCell(val, type);
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
                    <gel-table columns={this.columns} rows={this.rows} linkTo={(_, idx) => this.linkTo(idx)}></gel-table>
                </div>
            </div>
        </segment>;
    }

    linkTo(idx: number)
    {
        const id = this.values[idx]?.["id"];
        return id && `/${this.object.name}/${id}`;
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