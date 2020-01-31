import { Component, h, Prop, State, Event, EventEmitter, Watch } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene } from "../../../global/context";
import { pascalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneField, GrapheneListType, GrapheneObjectType } from "../../../libs/graphene";

const preferredColumns = ["id", "name", "title", "url", "description"];
const preferredEndColumns = ["created_at", "updated_at"];

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

    @State() definition: GrapheneField<GrapheneListType>;
    @State() columns: string[];
    @State() rows: any[] = [];
    @State() values: any[] = [];

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @Watch("match")
    async componentWillLoad()
    {
        this.clearBreadcrumb.emit();
        const name = this.match.params["name"];
        this.pushBreadcrumb.emit([name, this.match.url]);

        this.definition = this.graphene.getQuery(name); 
        const type = this.definition.type.ofType;
        if (!(type instanceof GrapheneObjectType)) return;
        
        const preferred = preferredColumns.filter(s => type.fieldMap[s] !== undefined);
        const preferredEnd = preferredEndColumns.filter(s => type.fieldMap[s] !== undefined);
        const rest = Object.keys(type.fieldMap).filter(s => !preferred.includes(s) && !preferredEnd.includes(s));

        this.columns = [
            ...preferred, 
            ...rest.slice(0, this.columnCount - preferred.length - preferredEnd.length),
            ...preferredEnd
        ]
        .map(col => type.fieldMap[col])
        .filter(field => field.isScalar())
        .map(field => field.name);

        this.rows = [];
        const request = `{
            ${name} {
                ${this.columns.join(" ")}
            }
        }`;

        //console.log(request);

        this.values = (await this.api.client.request(request))[name];

        for (const idx in this.values)
        {
            for (const [col, val] of Object.entries(this.values[idx]))
            {
                const cellType = type.fieldMap[col].type;
                console.log("Rendering ", col, val, cellType, cellType.renderCell(val));

                this.rows[idx] = this.rows[idx] ?? {};
                this.rows[idx][col] = () => cellType.renderCell(val);
            }
        }
    }

    render()
    {

        return <segment class="segment">
            <div class="container">
                <div class="box content has-blur-background">
                    <h1>{pascalCase(this.definition.name)}</h1>
                    <p>{ this.definition.description }</p>
                    <br />
                    <gel-table columns={this.columns} rows={this.rows} linkTo={(_, idx) => this.linkTo(idx)}></gel-table>
                </div>
            </div>
        </segment>;
    }

    linkTo(idx: number)
    {
        const id = this.values[idx]?.["id"];
        return id && `/${this.definition.name}/${id}`;
    }

}