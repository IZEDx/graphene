import { Component, h, Event, EventEmitter } from "@stencil/core";
import { graphene } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";


@Component({
    tag: 'view-login',
    //styleUrl: 'view-dashboard.scss',
})
export class LoginView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;

    @graphene.Context("api") api: GrapheneAPI;

    componentWillLoad()
    {
        this.pushBreadcrumb.emit(["Login", "/login"]);
    }

    onLogin()
    {
        console.log("login");
    }

    render()
    {
        return (
            <segment class="segment">
                <div class="container">
                    <div class="box content has-blur-background">
                        <div class="level">
                            <div class="level-item">
                                <h1>Login</h1>
                            </div>
                        </div>
                        <div class="level">
                            <div class="level-item">
                                <gel-form>
                                    <gel-input-text 
                                        formKey="name"
                                        label="username"
                                    ></gel-input-text>
                                    <gel-input-text 
                                        formKey="password"
                                        label="password"
                                        type="password"
                                    ></gel-input-text>
                                </gel-form>
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
                                            <button class="button is-primary" onClick={() => this.onLogin()}>Login</button>
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