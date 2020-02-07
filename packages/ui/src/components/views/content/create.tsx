import { Component, h, State, Listen } from "@stencil/core";
import { graphene, content } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneField, GrapheneEnumType, GrapheneInputObjectType, GrapheneListType } from "../../../libs/graphene";
import { pascalCase } from "change-case";

const preferredColumns = ["id", "name", "title", "url", "description"];
const readOnlyColumns = ["id", "created_at", "updated_at"];

@Component({
    tag: 'content-create',
    //styleUrl: 'view-edit.scss',
})
export class ContentCreate 
{
    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @content.Context("definition") definition: GrapheneQueryField<GrapheneObjectType>;
    @content.Context("listDef") listDef: GrapheneQueryField<GrapheneListType>;
    @content.Context("canCreate") canCreate: boolean;

    @State() entries: [string, any][] = [];
    @State() failed = false;

    fieldMap: Record<string, GrapheneField>;

    @content.Observe("definition")
    async componentWillLoad()
    {
        if (!this.definition) return;

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

            this.failed = false;
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

        return this.failed ? "Something went wrong" : [
            <div class="level is-mobile">
                <div class="level-left">
                    <div class="level-item">
                        <stencil-route-link url={"/"+this.listDef.name}>
                            <button class="button is-outlined">
                                <ion-icon name="return-left"></ion-icon>
                            </button>
                        </stencil-route-link>
                    </div>
                    <div class="level-item">
                        <p class="subtitle is-5">
                            <strong>{pascalCase(this.definition.name)}</strong>
                        </p>
                    </div>
                </div>
                <div class="level-right">
                    <div class="level-item">
                        <button class="button is-success" onClick={() => this.onSave()}>
                            Create &nbsp; <ion-icon name="save"></ion-icon>
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
}