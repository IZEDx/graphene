import { Component, h, Prop, State, Event, EventEmitter, Watch } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene } from "../../../global/context";
import { pascalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneListType, GrapheneObjectType, GrapheneScalarType, GrapheneQueryField, GrapheneField, GrapheneType } from "../../../libs/graphene";
import { GraphQLOutputType } from "graphql";

const preferredColumns = ["id", "name", "title", "url", "description"];
const preferredEndColumns = ["created_at", "updated_at"];

@Component({
    tag: 'view-list',
    styleUrl: 'style.scss',
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

    fieldMap: Record<string, GrapheneField<GrapheneType<GraphQLOutputType>>>;

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
        this.fieldMap = type.fieldMap;
        
        const preferred = preferredColumns.filter(s => this.fieldMap[s] !== undefined);
        const preferredEnd = preferredEndColumns.filter(s => this.fieldMap[s] !== undefined);
        const rest = Object.keys(this.fieldMap).filter(s => !preferred.includes(s) && !preferredEnd.includes(s));

        console.log(preferred, preferredEnd, rest);

        this.columns = [
            ...preferred, 
            ...rest.slice(0, this.columnCount - preferred.length - preferredEnd.length),
            ...preferredEnd
        ]
        .map(col => this.fieldMap[col])
        .filter(field => !!field.type.getType(GrapheneScalarType))
        .map(field => field.name);

        const request = `{
            ${this.definition.name} {
                ${this.columns.join(" ")}
            }
        }`;

        //console.log(request);

        this.values = (await this.api.client.request(request))[this.definition.name];

        this.updateRows();
    }

    updateRows(searchBy?: string)
    {
        this.rows = [];
        let c = 0;
        for (const idx in this.values)
        {
            let checksFilter = false;
            for (const [col, val] of Object.entries(this.values[idx]))
            {
                const cellType = this.fieldMap[col].type;
                console.log("Rendering ", col, val, cellType, cellType.renderCell(val));
                if (!searchBy || cellType.renderCell(val).toString().includes(searchBy)) checksFilter = true;

                this.rows[c] = this.rows[c] ?? {};
                this.rows[c]["_idx"] = idx;
                this.rows[c][col] = () => cellType.renderCell(val);
            }
            if (!checksFilter) delete this.rows[c];
            c++;
        }
    }

    onSearchInput(e: KeyboardEvent)
    {
        const el = e.target as HTMLInputElement;
        this.updateRows(el.value);
    }

    render()
    {

        return <segment class="segment">
            <div class="container is-fullheight">
                <div class="box content is-fullheight has-blur-background">
                    { !this.definition
                        ? [
                            <h1>404</h1>,
                            <p>View '{this.match.params["name"]}' not found.</p>
                        ]
                        : [
                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item content">
                                        <h2>
                                            <strong>{pascalCase(this.definition.name)}</strong>
                                        </h2>
                                        <p class="subtitle is-5">{ this.definition.description }</p>
                                    </div>
                                </div>
                                <div class="level-right list-controls">
                                    <div class="level-item">
                                        <input 
                                            class="input"
                                            type="text"
                                            placeholder="Search..." 
                                            onKeyUp={e => this.onSearchInput(e)}
                                        />
                                    </div>
                                    <div class="level-item">
                                        <stencil-route-link url={"/"+this.definition.name+"/new"}>
                                            <button class="button is-success">
                                                <ion-icon name="add-circle-outline"></ion-icon>
                                            </button>
                                        </stencil-route-link>
                                    </div>
                                </div>
                            </div>,
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