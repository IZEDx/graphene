import { Component, h, Prop, State, Watch } from "@stencil/core";
import { graphene, content } from "../../../global/context";
import { capitalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneListType, GrapheneObjectType, GrapheneQueryField, GrapheneField, GrapheneType } from "../../../libs/graphene";
import { GraphQLOutputType } from "graphql";
import { injectHistory, RouterHistory } from "@stencil/router";
import { GraphQLErrorMessage } from "../../../libs/utils";

@Component({
    tag: 'content-list'
})
export class ContentList 
{
    @Prop() columnCount = 8;
    @Prop() preferredColumns: string[] = [];
    @Prop() preferredEndColumns: string[] = [];
    @Prop() definition: GrapheneQueryField<GrapheneObjectType>;
    @Prop() history: RouterHistory;

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;
    @graphene.Context("baseUrl") baseUrl: string;

    @content.Context("listDef") listDef: GrapheneQueryField<GrapheneListType>;
    @content.Context("canCreate") canCreate: boolean;
    @content.Context("canEdit") canEdit: boolean;
    @content.Context("canDelete") canDelete: boolean;
    @content.Context("isList") isList: boolean;

    @State() columns: string[];
    @State() rows: any[] = [];
    @State() values: any[] = [];
    @State() failed = false;
    @State() error: Error;

    fieldMap: Record<string, GrapheneField<GrapheneType<GraphQLOutputType>>>;

    @Watch("definition")
    async componentWillLoad()
    {
        if (!this.listDef || !this.definition) return;

        try
        {
            const type = this.listDef.type.getType(GrapheneListType).ofType.getType(GrapheneObjectType);
            this.fieldMap = type.fieldMap;
    
            const preferred = this.preferredColumns.filter(s => this.fieldMap[s] !== undefined);
            const preferredEnd = this.preferredEndColumns.filter(s => this.fieldMap[s] !== undefined);
            const rest = Object.keys(this.fieldMap).filter(s => !preferred.includes(s) && !preferredEnd.includes(s));
    
            this.columns = [
                ...preferred, 
                ...rest.slice(0, this.columnCount - preferred.length - preferredEnd.length),
                ...preferredEnd
            ]
            .map(col => this.fieldMap[col])
            //.filter(field => !!field.type.getType(GrapheneScalarType))
            .map(field => field.name);
            
            const query = `{
                ${this.listDef.name} {
                    ${this.columns.map(c => this.fieldMap[c].toQuery()).join(" ")}
                }
            }`;

            this.values = (await this.api.client.request(query))?.[this.listDef.name];
    
            this.updateRows();
            this.failed = false;
        }
        catch(e)
        {
            console.error(e);
            this.error = e;
            this.failed = true;
        }
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
        if (!this.listDef) return "";
        return this.failed ? GraphQLErrorMessage(this.error) : [
            <div class="level is-mobile">
                <div class="level-left">
                    <div class="level-item content">
                        <h2>
                            <strong>{capitalCase(this.listDef.name)}</strong>
                        </h2>
                        <p class="subtitle is-5">{ this.listDef.description }</p>
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
                        { !this.definition.createMutation ? "" : 
                            <button class="button is-success" onClick={() => this.history.push(`${this.baseUrl}/${this.listDef.name}/new`, {})}>
                                New &nbsp; <ion-icon name="add-outline"></ion-icon>
                            </button> 
                        }
                    </div>
                </div>
            </div>,
            <gel-table columns={this.columns} rows={this.rows} linkTo={(row) => this.linkTo(row["_idx"])}></gel-table>
        ];
    }

    linkTo(idx: number)
    {
        const id = this.values[idx]?.["id"];
        return id && `${this.baseUrl}/${this.listDef.name}/${id}`;
    }

}

injectHistory(ContentList);