import { Component, h, Event, EventEmitter } from "@stencil/core";
import { graphene } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";


@Component({
    tag: 'view-dashboard',
    //styleUrl: 'view-dashboard.scss',
})
export class DashboardView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() clearBreadcrumb: EventEmitter;

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("isAuthorized") isAuthorized: boolean;
    @graphene.Context("baseUrl") baseUrl: string;

    componentDidLoad()
    {
        this.clearBreadcrumb.emit();
        this.pushBreadcrumb.emit(["Dashboard", this.baseUrl]);
    }

    render()
    {
        return <util-guard>
            <segment class="segment">
                <div class="container">
                    <div class="box content has-blur-background">
                        <h1>Welcome to Graphene</h1>
                    </div>
                </div>
            </segment>
        </util-guard>;
    }
} 