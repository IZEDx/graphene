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
    @nav.Context("isExpanded") isExpanded: boolean;

    @State() categories: Category[];

    async componentWillLoad()
    {
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
                        name: "Account",
                        url: "/user/",
                        children: [],
                        exact: true
                    }
                ]
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
        return (
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
