import { Component, h, Prop, State, Event, EventEmitter, Watch } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene } from "../../../global/context";
import { pascalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneListType, GrapheneObjectType, GrapheneScalarType, GrapheneQueryField } from "../../../libs/graphene";

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

    @State() definition: GrapheneQueryField<GrapheneListType>;
    @State() columns: string[];
    @State() rows: any[] = [];
    @State() values: any[] = [];

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @Watch("match")
    async componentWillLoad()
    {
        this.clearBreadcrumb.emit();
        this.definition = this.graphene.getQuery(this.match.params["name"]).asList(); 
        this.pushBreadcrumb.emit([this.definition.name, this.match.url]);

        if (!this.definition) return;

        const list = this.definition.type.ofType;
        const nonnull = list.isList() ? list.ofType : list;
        const type = nonnull.isNonNull() ? nonnull.ofType : nonnull;

        console.log(type);
        if (!(type instanceof GrapheneObjectType)) return;
        
        const preferred = preferredColumns.filter(s => type.fieldMap[s] !== undefined);
        const preferredEnd = preferredEndColumns.filter(s => type.fieldMap[s] !== undefined);
        const rest = Object.keys(type.fieldMap).filter(s => !preferred.includes(s) && !preferredEnd.includes(s));

        console.log(preferred, preferredEnd, rest);

        this.columns = [
            ...preferred, 
            ...rest.slice(0, this.columnCount - preferred.length - preferredEnd.length),
            ...preferredEnd
        ]
        .map(col => type.fieldMap[col])
        .filter(field => !!field.type.getType(GrapheneScalarType))
        .map(field => field.name);

        this.rows = [];
        const request = `{
            ${this.definition.name} {
                ${this.columns.join(" ")}
            }
        }`;

        //console.log(request);

        this.values = (await this.api.client.request(request))[this.definition.name];

        for (const idx in this.values)
        {
            for (const [col, val] of Object.entries(this.values[idx]))
            {
                const cellType = type.fieldMap[col].type;
                console.log("Rendering ", col, val, cellType, cellType.renderCell(val));

                this.rows[idx] = this.rows[idx] ?? {};
                this.rows[idx]["_idx"] = idx;
                this.rows[idx][col] = () => cellType.renderCell(val);
            }
        }
    }

    render()
    {

        return <segment class="segment">
            <div class="container">
                <div class="box content has-blur-background">
                    { !this.definition
                        ? [
                            <h1>404</h1>,
                            <p>View '{this.match.params["name"]}' not found.</p>
                        ]
                        : [
                            <h1>{pascalCase(this.definition.name)}</h1>,
                            <p>{ this.definition.description }</p>,
                            <br />,
                            <gel-table columns={this.columns} rows={this.rows} linkTo={(row) => this.linkTo(row["_idx"])}></gel-table>
                        ]
                    }
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