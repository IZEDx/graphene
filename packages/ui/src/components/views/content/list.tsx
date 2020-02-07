import { Component, h, Prop, State } from "@stencil/core";
import { graphene, content } from "../../../global/context";
import { pascalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneListType, GrapheneObjectType, GrapheneScalarType, GrapheneQueryField, GrapheneField, GrapheneType } from "../../../libs/graphene";
import { GraphQLOutputType } from "graphql";

@Component({
    tag: 'content-list'
})
export class ContentList 
{
    @Prop() columnCount = 8;
    @Prop() preferredColumns: string[] = [];
    @Prop() preferredEndColumns: string[] = [];

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @content.Context("definition") definition: GrapheneQueryField<GrapheneObjectType>;
    @content.Context("listDef") listDef: GrapheneQueryField<GrapheneListType>;
    @content.Context("canCreate") canCreate: boolean;
    @content.Context("canEdit") canEdit: boolean;
    @content.Context("canDelete") canDelete: boolean;
    @content.Context("isList") isList: boolean;

    @State() columns: string[];
    @State() rows: any[] = [];
    @State() values: any[] = [];
    @State() failed = false;

    fieldMap: Record<string, GrapheneField<GrapheneType<GraphQLOutputType>>>;

    @content.Observe("listDef")
    async componentWillLoad()
    {
        if (!this.listDef) return;

        try
        {
            console.log(this.listDef.type.getType(GrapheneListType));
            const type = this.listDef.type.getType(GrapheneListType).ofType.getType(GrapheneObjectType);
            console.log(this.listDef.type.getType(GrapheneListType));
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
            .filter(field => !!field.type.getType(GrapheneScalarType))
            .map(field => field.name);
            
            const query = `{
                ${this.listDef.name} {
                    ${this.columns.join(" ")}
                }
            }`;

            this.values = (await this.api.client.request(query))?.[this.listDef.name];
    
            this.updateRows();
            this.failed = false;
        }
        catch(e)
        {
            console.error(e);
            this.failed = true;
        }
    }

    /*
    @Watch("match")
    async componentWillLoad()
    {
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
    */

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
        if (!this.listDef) return "";
        return this.failed ? "Something went wrong" : [
            <div class="level is-mobile">
                <div class="level-left">
                    <div class="level-item content">
                        <h2>
                            <strong>{pascalCase(this.listDef.name)}</strong>
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
                            <stencil-route-link url={"/"+this.definition.name+"/new"}>
                                <button class="button is-success">
                                    New &nbsp; <ion-icon name="add-circle-outline"></ion-icon>
                                </button>
                            </stencil-route-link>
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
        return id && `/${this.listDef.name}/${id}`;
    }

}