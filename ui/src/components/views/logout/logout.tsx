import { Component, h, Event, EventEmitter, State } from "@stencil/core";
import { graphene } from "../../../global/context";


@Component({
    tag: 'view-logout',
    //styleUrl: 'view-dashboard.scss',
})
export class LogoutView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() clearBreadcrumb: EventEmitter<void>;
    @Event() logout: EventEmitter<void>;
    @graphene.Context("baseUrl") baseUrl: string;

    @State() isLoading = false;

    componentWillLoad()
    {
        this.clearBreadcrumb.emit();
        this.pushBreadcrumb.emit(["Logout", this.baseUrl + "/logout"]);
    }

    @graphene.Observe("isAuthorized")
    onAuthorization()
    {
        this.isLoading = false;
    }

    onLogout()
    {
        this.isLoading = true;
        this.logout.emit();
    }

    render()
    {
        return <util-guard>
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
                                            <button 
                                                class={{
                                                    "button": true,
                                                    "is-primary": true,
                                                    "is-loading": this.isLoading
                                                }} 
                                                disabled={this.isLoading}
                                                onClick={() => this.onLogout()}
                                            >
                                                Yes I am
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </segment>
        </util-guard>;
    }
} 