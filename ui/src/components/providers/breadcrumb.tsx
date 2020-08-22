import { Component, h, Listen } from "@stencil/core";
import { breadcrumb, graphene } from "../../global/context";
import { Breadcrumbs } from "../elements/breadcrumbs/model";
import { pascalCase } from "change-case";
import { Graphene } from "../../libs/graphene";

@Component({
    tag: 'breadcrumb-provider'
})
export class BreadcrumbProvider 
{
    @graphene.Context("graphene") graphene: Graphene;
    @graphene.Context("baseUrl") baseUrl: string;
    @breadcrumb.Provide("breadcrumbs") breadcrumbs: Breadcrumbs = [];
    
    @graphene.Observe("graphene")
    async onGraphene()
    {
        if (this.breadcrumbs) this.breadcrumbs = [[this.graphene?.api?.url, this.graphene?.api?.url, true], ...this.breadcrumbs.slice(1)];
        else this.breadcrumbs = [[this.graphene?.api?.url, this.graphene?.api?.url, true]];
    }

    @Listen("pushBreadcrumb")
    onPushBreadcrumb(e: CustomEvent<[string, string]>)
    {
        const text = e.detail[0].startsWith("http") ? e.detail[0] : pascalCase(e.detail[0]);
        const bc = [text, e.detail[1]] as [string, string];
        this.breadcrumbs = [...this.breadcrumbs, bc]
            .slice(0, this.breadcrumbs.findIndex(b => b[0] === bc[0]) + 1 || undefined);;
    }

    @Listen("popBreadcrumb")
    onPopBreadcrumb()
    {
        this.breadcrumbs = this.breadcrumbs.slice(0, this.breadcrumbs.length - 1);
    }

    @Listen("clearBreadcrumb")
    onClearBreadcrumb()
    {
        this.breadcrumbs = [this.breadcrumbs[0]];
    }

    @Listen("pageLeave")
    onPageLeave(page: any)
    {
        console.log("Page Leave", page);
        this.breadcrumbs = this.breadcrumbs.slice(0, this.breadcrumbs.length - 1);
    }

    render()
    {
        return <slot />;
    }
}
