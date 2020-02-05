import { Component, Prop, h, Host, Listen, State } from '@stencil/core';
import { graphene, nav } from '../../global/context';
import { GrapheneAPI, APIQueries } from '../../global/api';
import { API } from '../../libs/api';
import "@stencil/router";
import { Breadcrumbs } from '../elements/breadcrumbs/model';
import { pascalCase } from "change-case";
import { MenuItem } from '../elements/menu/model';
import { Graphene } from '../../libs/graphene';

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
    @graphene.Provide("graphene") graphene: Graphene;
    @graphene.Provide("connected") isConnected = false;

    @nav.Provide("isExpanded") isExpanded = false;

    async componentWillLoad()
    {
        this.api = new API(this.endPoint, undefined/*this.token*/, APIQueries);
        this.graphene = new Graphene(this.api);
        this.breadcrumb = [[this.endPoint, "/"]];

        await this.graphene.load();
        this.isConnected = true;
        console.log(this.graphene);
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

    @Listen("clearBreadcrumb")
    onClearBreadcrumb()
    {
        this.breadcrumb = [this.breadcrumb[0]];
        console.log(this.breadcrumb);
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

                    <div class="dashboard-main">
                        <nav class="navbar">
                            <div class="navbar-brand">
                                <span class="navbar-item is-hidden-mobile">
                                    <gel-breadcrumbs breadcrumbs={this.breadcrumb}></gel-breadcrumbs>
                                </span> 
                                <span role="button" class="navbar-burger burger is-hidden-tablet" aria-label="menu" aria-expanded={this.isExpanded} onClick={() => this.isExpanded = !this.isExpanded}>
                                    <span aria-hidden="true"></span>
                                    <span aria-hidden="true"></span> 
                                    <span aria-hidden="true"></span>
                                </span>
                            </div>
                        </nav>

                        <div class="body is-fullheight">
                            <stencil-router onClick={() => {
                                this.isExpanded = false;
                            }}>
                                <stencil-route-switch scrollTopOffset={0}>
                                    <stencil-route url="/login" component="view-login" routeRender={routeListener} />
                                    <stencil-route url="/logout" component="view-logout" routeRender={routeListener} />
                                    <stencil-route url="/:name/new" component="view-create" routeRender={routeListener} />
                                    <stencil-route url="/:name/:id" component="view-edit" routeRender={routeListener} />
                                    <stencil-route url="/:name" component="view-list" routeRender={routeListener} />
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
