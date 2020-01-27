import { Component, h, Event, EventEmitter } from "@stencil/core";
import { graphene } from "../../../global/context";
import { GraphQLSchema } from "graphql";
import { GrapheneAPI } from "../../../global/api";


@Component({
    tag: 'view-dashboard',
    //styleUrl: 'view-dashboard.scss',
})
export class DashboardView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;

    @graphene.Context("schema") schema: GraphQLSchema;
    @graphene.Context("api") api: GrapheneAPI;

    componentWillLoad()
    {
        this.pushBreadcrumb.emit([this.api.url, "/"]);
    }

    render()
    {
        console.log();
        return <div class="box is-fullheight">
            <div class="content">
                <h1>Welcome to Graphene</h1>
            </div>
        </div>;
    }
} 