import { Component, h, Prop, State, Event, EventEmitter, Host, Watch } from "@stencil/core";
import { graphene, content } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene, GrapheneQueryField, GrapheneObjectType, GrapheneListType } from "../../../libs/graphene";
import { RouterHistory, injectHistory } from "@stencil/router";

@Component({
    tag: 'content-delete',
    //styleUrl: 'view-edit.scss',
})
export class ContentDelete 
{
    @Event() apiError: EventEmitter<any>;
    @Event() successToast: EventEmitter<string>;

    @Prop() history: RouterHistory;
    @Prop() params: Record<string, string|number>|undefined;

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("graphene") graphene: Graphene;

    @content.Context("definition") definition: GrapheneQueryField<GrapheneObjectType>;
    @content.Context("listDef") listDef: GrapheneQueryField<GrapheneListType>;
    @content.Context("canDelete") canDelete: boolean;
    @content.Context("isList") isList: boolean;

    @State() failed = false;
    @State() isLoading = false;
    @State() isDeleting = false;
    @State() id: string;
    
    @Watch("params")
    componentWillLoad()
    {
        this.id = this.params["id"]+"";
    }

    async onDelete()
    {
        try
        {
            this.isDeleting = true;
            await this.definition.delete(this.id);
            this.successToast.emit(`Deleted ${this.definition.name} with id ${this.id}`);
            this.history.push(`/${this.listDef.name}/`);
        }
        catch(e)
        {
            this.apiError.emit(e);
        } 
        this.isDeleting = false;
    }

    render() 
    {
        console.log("delete", this.params);
        return <Host>
            <div class="level">
                <div class="level-item">
                    <h1>Delete</h1>
                </div>
            </div>
            <div class="level">
                <div class="level-item content">
                    <p>Are you sure you want to delete {this.definition.name} with id {this.id}?</p>
                </div>
            </div>
            <div class="level">
                <div class="level-item">
                    <div class="level">
                        <div class="level-left">
                            <div class="level-item content">
                            </div>
                        </div>
                        <div class="level-right">
                            <div class="level-item">
                                <button 
                                    class={{
                                        "button": true,
                                        "is-primary": true,
                                        "is-loading": this.isLoading
                                    }} 
                                    disabled={this.isLoading}
                                    onClick={() => this.onDelete()}
                                >
                                    Yes I am
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Host>;
    }
}

injectHistory(ContentDelete);