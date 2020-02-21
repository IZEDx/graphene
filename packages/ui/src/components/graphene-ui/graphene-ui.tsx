import { Component, Prop, h, Listen, State } from '@stencil/core';
import { nav } from '../../global/context';
import "@stencil/router";

@Component({
    tag: 'graphene-ui',
    styleUrl: 'graphene-ui.scss',
})
export class GrapheneUI 
{
    @Prop() endPoint: string;
    @Prop() token?: string;

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
            <div class="dashboard is-full-height">
                <graphene-nav></graphene-nav>

                <div class={{
                    "dashboard-main": true,
                    "has-background": this.showBackground
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
                                <stencil-route url="/login" component="view-login" routeRender={routeListener} />
                                <stencil-route url="/logout" component="view-logout" routeRender={routeListener} />
                                <stencil-route url="/:name/new" component="view-content" routeRender={routeListener}  componentProps={{isCreate: true}}/>
                                <stencil-route url="/:name/:id/delete" component="view-content" routeRender={routeListener} componentProps={{isDelete: true}}/>
                                <stencil-route url="/:name/:id" component="view-content" routeRender={routeListener}  componentProps={{isEdit: true}}/>
                                <stencil-route url="/:name" component="view-content" routeRender={routeListener}/>
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
        );
    }

    wrapProviders(jsx: any)
    {
        return (
            <notification-provider>
                <graphene-provider endPoint={this.endPoint} token={this.token}>
                    <breadcrumb-provider>
                        {jsx}
                    </breadcrumb-provider>
                </graphene-provider>
            </notification-provider>
        )
    }
}
