import { Component, h, Event, EventEmitter } from "@stencil/core";
import { graphene } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";


@Component({
    tag: 'view-logout',
    //styleUrl: 'view-dashboard.scss',
})
export class LogoutView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;

    @graphene.Context("api") api: GrapheneAPI;
    componentWillLoad()
    {
        this.pushBreadcrumb.emit(["Logout", "/logout"]);
    }

    async onLogout()
    {
        const query = `
            mutation {
                logout
            }
        `;

        await this.api.client.request(query);
        localStorage.removeItem("token");
        this.api.setToken(undefined);
    }

    render()
    {
        return (
            <segment class="segment">
                <div class="container">
                    <div class="box content has-blur-background">
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
                                            <button class="button is-primary" onClick={() => this.onLogout()}>Yes I am</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </segment>
        );
    }
} 