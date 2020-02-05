import { Component, h, Prop, Event, EventEmitter, Watch, State, Listen } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneField, GrapheneEnumType, GrapheneInputObjectType } from "../../../libs/graphene";
import { pascalCase } from "change-case";

const preferredColumns = ["id", "name", "title", "url", "description"];
const readOnlyColumns = ["id", "created_at", "updated_at"];

@Component({
    tag: 'view-create',
    //styleUrl: 'view-edit.scss',
})
export class CreateView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() clearBreadcrumb: EventEmitter<void>;

    @Prop() match: MatchResults;

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @State() definition: GrapheneQueryField<GrapheneObjectType>;
    @State() entries: [string, any][] = [];
    @State() failed = false;

    fieldMap: Record<string, GrapheneField>;

    get name()
    {
        return this.match.params["name"];
    }

    @Watch("match")
    async refresh(newMatch?: MatchResults, oldMatch?: MatchResults)
    {
        if (newMatch && oldMatch && newMatch.url !== oldMatch.url) this.clearBreadcrumb.emit();
        await this.componentWillLoad();
    }

    async componentWillLoad()
    {
        this.clearBreadcrumb.emit();
        this.pushBreadcrumb.emit([this.name, this.match.url]);
        this.pushBreadcrumb.emit(["new", this.match.url]);

        this.definition = this.graphene.getQuery(this.name)?.asObject();
    }

    async componentDidLoad()
    {
        if (this.failed) return;
        
        try
        {
            const mutationArg = this.definition.createMutation.args.find(arg => arg.type.getType(GrapheneInputObjectType));
            const mutationType = mutationArg?.type.getType(GrapheneInputObjectType);
            this.fieldMap = mutationType?.fieldMap;
            
            //.getType(GrapheneObjectType)?.fieldMap;

            this.entries = Object.entries(this.fieldMap)
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
                })
                .map(e => [e[0], undefined]);
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
        const result = await this.definition.create(this.entries.reduce((a, [k,v]) => ({...a, [k]: v}), {}));
        console.log(result);
    }

    render() 
    {

        return <segment class="segment">
            <div class="container">
                <div class="box has-blur-background">
                    { !this.definition
                        ? [
                            <h1>404</h1>,
                            <p>View '{this.name}' not found.</p>
                        ]
                        : [
                            <div class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <stencil-route-link url={"/"+this.name}>
                                            <button class="button is-outlined">
                                                <ion-icon name="return-left"></ion-icon>
                                            </button>
                                        </stencil-route-link>
                                    </div>
                                    <div class="level-item">
                                        <p class="subtitle is-5">
                                            <strong>{pascalCase(this.name)}</strong>
                                        </p>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <button class="button is-success" onClick={() => this.onSave()}>
                                            <ion-icon name="save"></ion-icon>
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            <gel-form>
                                { this.entries?.map(([key, value]) => {
                                    const {type, name} = this.fieldMap[key];
                                    return type?.renderEdit({ 
                                        formKey: key, 
                                        value: value, 
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
}