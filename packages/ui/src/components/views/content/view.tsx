import { Component, h, Prop, Event, EventEmitter, Watch, } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene, content } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneObjectType, GrapheneQueryField, GrapheneListType } from "../../../libs/graphene";

const preferredColumns = ["id", "name", "title", "url", "description"];
const preferredEndColumns = ["created_at", "updated_at"];
const readOnlyColumns = ["id", "created_at", "updated_at"];

@Component({
    tag: 'view-content',
    //styleUrl: 'view-edit.scss',
})
export class ContentView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() clearBreadcrumb: EventEmitter<void>;

    @Prop() match: MatchResults;
    @Prop() isCreate?: boolean;
    @Prop() isDelete?: boolean;
    @Prop() isEdit?: boolean;

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;
    @graphene.Context("isAuthorized") isAuthorized: boolean;

    @content.Provide("definition") definition: GrapheneQueryField<GrapheneObjectType>;
    @content.Provide("listDef") listDef: GrapheneQueryField<GrapheneListType>;
    @content.Provide("canCreate") canCreate = false;
    @content.Provide("canEdit") canEdit = false;
    @content.Provide("canDelete") canDelete = false;
    @content.Provide("isList") isList = false;

    get name()
    {
        return this.match.params["name"];
    }

    get id()
    {
        return this.match.params["id"];
    }


    async componentWillLoad()
    {
        await this.refresh();
    }

    @graphene.Observe("graphene")
    @Watch("match")
    async refresh(_graphene?: any)
    {
        this.clearBreadcrumb.emit();

        this.definition = this.graphene?.getQuery(this.name)?.asObject();
        if (!this.definition) return;

        this.canCreate = !!this.definition.createMutation;
        this.canEdit = !!this.definition.editMutation;
        this.canDelete = !!this.definition.deleteMutation;
        this.isList = !!this.definition.asList().type.getType(GrapheneListType);
        this.listDef = this.isList ? this.definition.asList() : undefined;

        this.pushBreadcrumb.emit([this.name, "/" + (this.listDef?.name ?? this.name)]);
        if (this.id) this.pushBreadcrumb.emit([this.id, this.match.url]);

        //console.log(this.definition.asList());
    }


    render() 
    {
        return <util-guard>
            <segment class="segment">
                <div class="container">
                    <div class="box has-blur-background">
                        { this.renderView() }
                    </div>
                </div>
            </segment>
        </util-guard>;
    }

    renderView()
    {
        if (!this.definition) return (
            <h1>404</h1>
        );

        if (this.isCreate && this.isList) return (
            <content-create></content-create>
        );

        if (this.isDelete) return (
            <content-delete 
                params={this.id ? {id: this.id} : undefined}
            ></content-delete>
        );

        if (this.isEdit) return (
            <content-edit 
                params={this.id ? {id: this.id} : undefined}
                preferredColumns={preferredColumns} 
                readonlyColumns={readOnlyColumns}
            ></content-edit>
        );

        return (
            <content-list 
                definition={this.definition}
                preferredColumns={preferredColumns} 
                preferredEndColumns={preferredEndColumns}
            ></content-list>
        );
    }
}