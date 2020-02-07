import { Component, h, Event, EventEmitter, Listen } from "@stencil/core";
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
    form = {
        name: "",
        password: ""
    }

    componentWillLoad()
    {
        this.pushBreadcrumb.emit(["Login", "/login"]);
    }

    async onLogin()
    {
        const loginQuery = `
            mutation {
                login(data: {
                    name: "${this.form.name}",
                    password: "${this.form.password}"
                })
            }
        `;

        const result = await this.api.client.request(loginQuery);
        const token = result?.login;
        if (token)
        {
            localStorage.setItem("token", token);
            this.api.setToken(localStorage.getItem("token"));
        }
    }

    @Listen("inputUpdate")
    onInputUpdate(_e: CustomEvent<{formKey: string, value: string}>)
    {
        this.form[_e.detail.formKey] = _e.detail.value;
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
                                        autoComplete="on"
                                    ></gel-input-text>
                                    <gel-input-text 
                                        formKey="password"
                                        label="password"
                                        type="password"
                                        autoComplete="on"
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