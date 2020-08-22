import { Component, Prop, h, Listen, State } from '@stencil/core';
import { graphene, nav } from '../../global/context';
import "@stencil/router";

@Component({
    tag: 'graphene-ui',
    styleUrl: 'graphene-ui.scss',
})
export class GrapheneUI 
{
    @Prop() endPoint: string;
    @Prop() baseUrl = "/";
    @Prop() token?: string;

    @graphene.Provide("connected") connected = false;
    @nav.Provide("isExpanded") isExpanded = false;

    @State() showBackground = false;


    @Listen("toggleBackground")
    onToggleBackground(e: CustomEvent<boolean>)
    {
        this.showBackground = e.detail;
    }

    render() 
    {
        const routeListener = (props: any) => <util-route-listener props={props} />;

        return this.wrapProviders(
            <div class={{"dashboard": true,  "is-full-height": true}}>
                <graphene-nav></graphene-nav>

                <div class={{
                    "dashboard-main": true,
                    "has-background": this.showBackground && this.connected,
                    "visible": this.connected
                }}>
                    <nav class="navbar">
                        <div class="navbar-brand">
                            <span class="navbar-item is-hidden-mobile">
                                <gel-breadcrumbs></gel-breadcrumbs>
                            </span> 
                            <span role="button" class="navbar-burger burger is-hidden-tablet" aria-label="menu" aria-expanded={this.isExpanded} onClick={() => this.isExpanded = !this.isExpanded}>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span> 
                                <span aria-hidden="true"></span>
                            </span>
                        </div>
                    </nav>

                    <div class="body is-fullheight" onClick={() => {
                        this.isExpanded = false;
                    }}>
                        <stencil-router >
                            <stencil-route-switch scrollTopOffset={0}>
                                <stencil-route url={`${this.baseUrl}/login`} component="view-login" routeRender={routeListener} />
                                <stencil-route url={`${this.baseUrl}/logout`} component="view-logout" routeRender={routeListener} />
                                <stencil-route url={`${this.baseUrl}/:name/new`} component="view-content" routeRender={routeListener}  componentProps={{isCreate: true}}/>
                                <stencil-route url={`${this.baseUrl}/:name/:id/delete`} component="view-content" routeRender={routeListener} componentProps={{isDelete: true}}/>
                                <stencil-route url={`${this.baseUrl}/:name/:id`} component="view-content" routeRender={routeListener}  componentProps={{isEdit: true}}/>
                                <stencil-route url={`${this.baseUrl}/:name`} component="view-content" routeRender={routeListener}/>
                                <stencil-route url={`${this.baseUrl}`} component="view-dashboard" routeRender={routeListener} />
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
        );
    }

    wrapProviders(jsx: any)
    {
        return (
            <notification-provider>
                <graphene-provider endPoint={this.endPoint} token={this.token} baseUrl={this.baseUrl}>
                    <breadcrumb-provider>
                        {jsx}
                    </breadcrumb-provider>
                </graphene-provider>
            </notification-provider>
        )
    }
}
