import { Component, h, State } from '@stencil/core';
import { graphene, nav } from '../../global/context';
import { Category } from '../elements/menu/model';
import { pascalCase } from "change-case";
import { mergeClass } from '../../libs/utils';
import { Graphene } from '../../libs/graphene';

@Component({
    tag: 'graphene-nav',
    styleUrl: 'graphene-nav.scss',
})
export class GrapheneNav 
{
    @graphene.Context("graphene") graphene: Graphene;
    @graphene.Context("connected") isConnected: boolean;
    @graphene.Context("isAuthorized") isAuthorized: boolean;
    @nav.Context("isExpanded") isExpanded: boolean;

    @State() categories: Category[] = [];

    @graphene.Observe("graphene")
    async onGraphene()
    {
        if (!this.graphene)
        {
            this.categories = [];
            return;
        }
        
        this.categories = [
            {
                name: "General",
                items: [
                    {
                        name: "Dashboard",
                        url: "/",
                        children: [],
                        exact: true
                    },
                    {
                        name: "Logout",
                        url: "/logout",
                        children: [],
                        exact: true
                    }
                ]
            },
            {
                name: "Single",
                items: this.graphene.queryObjects
                .filter(f => f.args.length === 0)  
                .filter(f => !!f.editMutation)              
                .map(({name}) => ({
                    name: pascalCase(name), 
                    url: `/${name}`, 
                    children: [], 
                    exact: false
                }))
            },
            {
                name: "Content",
                items: this.graphene.queryLists.map(({name}) => ({
                    name: pascalCase(name), 
                    url: `/${name}`, 
                    children: [], 
                    exact: false
                }))
            }
        ]
    }

    render() {
        return !this.isConnected || !this.isAuthorized ? "" : (
            <div class={mergeClass("dashboard-panel is-scrollable is-medium", {"is-hidden-mobile": !this.isExpanded})}>
                <header class="dashboard-panel-header">
                    <div class="has-text-centered header content">
                        <h1 class="h1">Graphene</h1>
                    </div>
                </header>

                <div class="dashboard-panel-content">
                    <gel-menu
                        categories={this.categories}
                    ></gel-menu>
                </div>
            </div>
        );
    } 
}
