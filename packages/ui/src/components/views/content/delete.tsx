import { Component, h, Prop, State, Event, EventEmitter, Host } from "@stencil/core";
import { graphene } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";
import { Graphene } from "../../../libs/graphene";
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

    @State() failed = false;
    @State() isLoading = false;

    render() 
    {
        console.log("delete", this.params);
        return <Host>
            <div class="level">
                <div class="level-item">
                    <h1>Logout</h1>
                </div>
            </div>
            <div class="level">
                <div class="level-item content">
                    <p>Are you sure you want to log out?</p>
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
                                    onClick={() => {}}
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