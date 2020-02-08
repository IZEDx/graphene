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

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("isAuthorized") isAuthorized: boolean;

    componentWillLoad()
    {
        this.pushBreadcrumb.emit([this.api.url, "/"]);
    }

    render()
    {
        return <util-guard>
            <div class="content">
                <h1>Welcome to Graphene</h1>
            </div>
        </util-guard>;
    }
} 