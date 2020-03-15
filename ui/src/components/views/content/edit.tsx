import { Component, h, Prop, State, Listen, Event, EventEmitter } from "@stencil/core";
import { graphene, content } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneField, GrapheneListType, GrapheneInputObjectType } from "../../../libs/graphene";
import { capitalCase } from "change-case";
import { RouterHistory, injectHistory } from "@stencil/router";
import { GraphQLErrorMessage } from "../../../libs/utils";

@Component({
    tag: 'content-edit',
    //styleUrl: 'view-edit.scss',
})
export class ContentEdit 
{
    @Event() apiError: EventEmitter<any>;
    @Event() successToast: EventEmitter<string>;

    @Prop() history: RouterHistory;
    @Prop() params: Record<string, string|number>|undefined;
    @Prop() preferredColumns: string[] = [];
    @Prop() readonlyColumns: string[] = [];

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @content.Context("definition") definition: GrapheneQueryField<GrapheneObjectType>;
    @content.Context("listDef") listDef: GrapheneQueryField<GrapheneListType>;
    @content.Context("canEdit") canEdit: boolean;
    @content.Context("canDelete") canDelete: boolean;
    @content.Context("isList") isList: boolean;

    @State() entries: [string, any][]; 
    @State() failed = false;
    @State() isSaving = false;
    @State() isDeleting = false;
    @State() error: Error;

    fieldMap: Record<string, GrapheneField>;
    editType: GrapheneInputObjectType;

    get entryMap()
    {
        return this.entries?.reduce((a, [k,v]) => ({...a, [k]: v})) ?? {};
    }

    @content.Observe("definition")
    async componentWillLoad()
    {
        try
        {
            const object = (await this.definition.request(this.params))?.[this.definition.name];
        
            this.editType = this.definition.editMutation.args.find(a => a.name === "data").type.getType(GrapheneInputObjectType);

            if (!this.editType)
            {
                console.log(this.definition.editMutation.args);
                this.failed = true;
                return;
            }

            this.entries = Object.entries(object)
                .sort((a, b) => {
                    const aIdx = this.preferredColumns.findIndex((k) => k === a[0]);
                    const bIdx = this.preferredColumns.findIndex((k) => k === b[0]);
    
                    if (aIdx === -1 && bIdx !== -1)
                        return 1;
                    if (aIdx !== -1 && bIdx === -1)
                        return -1;
                    if (aIdx === -1 && bIdx === -1)
                        return 0;
    
                    return aIdx > bIdx ? 1 : -1;
                });
    
            this.fieldMap = this.definition.type.getType(GrapheneObjectType)?.fieldMap;
            this.failed = false;
        }
        catch(e)
        {
            console.error(e);
            this.error = e;
            this.failed = true;
        }
        
    }

    @Listen("inputUpdate")
    onInputUpdate(e: CustomEvent<{formKey: string, value: string}>)
    {
        const entry = this.entries.find(([k]) => k === e.detail.formKey);
        entry[1] = e.detail.value;
        this.entries = this.entries;
    }

    async onSave()
    {
        try
        {
            this.isSaving = true;
            const result = await this.definition.edit<{id: string}>(this.entryMap);
            this.successToast.emit("Save successful");
            this.history.push(`/${this.listDef.name}/${result.id}`);
        }
        catch(e)
        {
            this.apiError.emit(e);
        } 
        this.isSaving = false;
    }

    async onDelete()
    {
        this.history.push(`/${this.listDef.name}/${this.params?.id}/delete`);
    }

    get title()
    {
        if (this.params?.id)
        {
            const entry = this.entries.find(([k]) => k === "name" || k === "title");
            console.log(entry, this.entries);
            if (entry) return this.fieldMap[entry[0]].type.renderCell(entry[1]);

            return `${capitalCase(this.definition.name)} (${this.params.id})`;
        }
        return capitalCase(this.definition.name);
    }

    render() 
    {

        console.log("readonly", this.readonlyColumns, this.definition.type);

        return this.failed ? GraphQLErrorMessage(this.error) : [
            <div class="level is-mobile">
                <div class="level-left">
                    { !this.isList ? "" :
                        <div class="level-item">
                            <stencil-route-link url={"/"+this.listDef.name}>
                                <button class="button is-white">
                                    <ion-icon name="chevron-back-outline"></ion-icon>
                                </button>
                            </stencil-route-link>
                        </div>
                    }
                    
                    <div class="level-item">
                        <p class="subtitle is-5">
                            <strong>{this.title}</strong>
                        </p>
                    </div>
                </div>
                <div class="level-right">
                    { !this.canDelete ? "" : 
                        <div class="level-item">
                            <button 
                                class={{
                                    "button": true,
                                    "is-danger": true,
                                    "is-loading": this.isDeleting
                                }} 
                                disabled={this.isDeleting}
                                onClick={() => this.onDelete()}
                            >
                                Delete &nbsp; <ion-icon name="trash"></ion-icon>
                            </button>
                        </div>
                    }
                    { !this.canEdit ? "" : 
                        <div class="level-item">
                            <button 
                                class={{
                                    "button": true,
                                    "is-success": true,
                                    "is-loading": this.isSaving
                                }} 
                                disabled={this.isSaving}
                                onClick={() => this.onSave()}
                            >
                                Save &nbsp; <ion-icon name="save"></ion-icon>
                            </button>
                        </div>
                    }
                </div>
            </div>,
            <gel-form>
                { this.editType.renderEdit(this.entryMap, this.readonlyColumns) }
                {/* this.entries?.map(([key, value]) => {
                    const {type, name} = this.fieldMap[key];
                    return type?.renderEdit({ 
                        formKey: key, 
                        value, 
                        label: name, 
                        options: type.getType(GrapheneEnumType)?.values,
                        disabled: this.readonlyColumns.findIndex(v => v === key) > -1
                    })
                })*/ }
            </gel-form>
        ];
    }
}

injectHistory(ContentEdit);