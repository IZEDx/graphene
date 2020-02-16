import { Component, h, Host } from "@stencil/core";
import { graphene } from "../../global/context";


@Component({
    tag: 'util-guard',
    //styleUrl: 'gel-menu.scss',
})
export class UtilGuard 
{
    @graphene.Context("connected") isConnected: boolean;
    @graphene.Context("isAuthorized") isAuthorized: boolean;

    render()
    {
        return <Host>
            <div class={{
                "pageloader": true,
                "is-active": !this.isConnected
            }}>
                <span class="title">Graphene</span>
            </div>
            {this.isAuthorized ? "" : <view-login></view-login>}
            <div style={this.isConnected && this.isAuthorized ? {} : {display: "none"}}>
                <slot></slot>
            </div>  
        </Host>
    }
}