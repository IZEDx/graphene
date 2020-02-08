import { Component, h, Event, EventEmitter, Listen, State } from "@stencil/core";
import { graphene } from "../../../global/context";
import { GrapheneAPI } from "../../../global/api";


@Component({
    tag: 'view-login',
    //styleUrl: 'view-dashboard.scss',
})
export class LoginView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() login: EventEmitter<{name: string, password: string}>;
    @Event() clearBreadcrumb: EventEmitter<void>;

    @State() isLoading = false;

    @graphene.Context("api") api: GrapheneAPI;
    form = {
        name: "",
        password: ""
    }

    componentWillLoad()
    {
        this.clearBreadcrumb.emit();
        this.pushBreadcrumb.emit(["Login", "/login"]);
    }

    @graphene.Observe("isAuthorized")
    onAuthorization()
    {
        this.isLoading = false;
    }

    @Listen("submit")
    onSubmit()
    {
        this.isLoading = true;
        this.login.emit(this.form);
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
                                <h1>Graphene</h1>
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
                                            <button 
                                                class={{
                                                    "button": true,
                                                    "is-primary": true,
                                                    "is-loading": this.isLoading
                                                }} 
                                                disabled={this.isLoading}
                                                onClick={() => this.onSubmit()}
                                            >
                                                Login
                                            </button>
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