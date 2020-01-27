import { Component, Prop, h, Host, Listen, State } from '@stencil/core';
import { graphene, GraphQLObjects, nav } from '../../global/context';
import { GrapheneAPI, APIQueries } from '../../global/api';
import { API } from '../../libs/api';
import { buildClientSchema, GraphQLSchema } from 'graphql';
import "@stencil/router";
import { Breadcrumbs } from '../elements/gel-breadcrumbs/model';
import { pascalCase } from "change-case";
import { MenuItem } from '../elements/gel-menu/model';

@Component({
    tag: 'graphene-ui',
    styleUrl: 'graphene-ui.scss',
})
export class GrapheneUI 
{
    @Prop() endPoint: string;
    @Prop() token: string;

    @State() breadcrumb: Breadcrumbs = [["Dashboard", "/"]];

    @graphene.Provide("api") api: GrapheneAPI;
    @graphene.Provide("schema") schema: GraphQLSchema;
    @graphene.Provide("objects") objects: GraphQLObjects;
    @graphene.Provide("connected") isConnected: boolean;

    @nav.Provide("isExpanded") isExpanded = false;

    async componentWillLoad()
    {
        this.api = new API(this.endPoint, this.token, APIQueries);
        this.schema = buildClientSchema(await this.api.query("introspect"));
        this.objects = this.schema.getQueryType().getFields() as any;
        this.isConnected = true;
        this.breadcrumb = [[this.endPoint, "/"]];
    }

    @Listen("pushBreadcrumb")
    onPushBreadcrumb(e: CustomEvent<[string, string]>)
    {
        const text = e.detail[0].startsWith("http") ? e.detail[0] : pascalCase(e.detail[0]);
        const bc = [text, e.detail[1]] as [string, string];
        this.breadcrumb = [...this.breadcrumb, bc]
            .slice(0, this.breadcrumb.findIndex(b => b[0] === bc[0]) + 1 || undefined);;
    }

    @Listen("popBreadcrumb")
    onPopBreadcrumb()
    {
        this.breadcrumb = this.breadcrumb.slice(0, this.breadcrumb.length - 1);
    }

    @Listen("pageLeave")
    onPageLeave(page: any)
    {
        console.log("Page Leave", page);
        this.breadcrumb = this.breadcrumb.slice(0, this.breadcrumb.length - 1);
    }

    @Listen("navigate")
    onNavigate(_item: MenuItem)
    {
        this.isExpanded = false;
    }

    render() {
        const routeListener = (props: any) => <util-route-listener props={props} />;
        return (
            <Host>
                <div class="dashboard is-full-height">
                    <graphene-nav></graphene-nav>

                    <div class="dashboard-main is-scrollable">
                        <nav class="navbar is-fixed-top">
                            <div class="navbar-brand">
                                <span class="navbar-item is-hidden-mobile">
                                    <gel-breadcrumbs breadcrumbs={this.breadcrumb}></gel-breadcrumbs>
                                </span> 
                                <span role="button" class="navbar-burger burger" aria-label="menu" aria-expanded={this.isExpanded} onClick={() => this.isExpanded = !this.isExpanded}>
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span> 
                                    <span aria-hidden="true"></span>
                                </span>
                            </div>
                        </nav>

                        <div class="body box is-fullheight">
                            <stencil-router onClick={() => {
                                this.isExpanded = false;
                            }}>
                                <stencil-route-switch scrollTopOffset={0}>
                                    <stencil-route url="/list/:name" component="view-list" routeRender={routeListener} />
                                    <stencil-route url="/" component="view-dashboard" routeRender={routeListener} />
                                </stencil-route-switch>
                            </stencil-router>
                        </div>

                        {/*
                            <footer class="footer">
                                Footer
                            </footer>
                        */}
                    </div>
                    {/*
                        <div class="dashboard-panel is-small">
                        </div>
                    */}
                </div>
            </Host>
        )
    }
}
