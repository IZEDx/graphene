import { Component, h, State } from '@stencil/core';
import { graphene, GraphQLObjects, nav } from '../../global/context';
import {  GraphQLSchema, GraphQLList } from 'graphql';
import { Category } from '../elements/gel-menu/model';
import { pascalCase } from "change-case";
import { mergeClass } from '../../libs/utils';

@Component({
    tag: 'graphene-nav',
    styleUrl: 'graphene-nav.scss',
})
export class GrapheneNav 
{
    @graphene.Context("schema") schema: GraphQLSchema;
    @graphene.Context("objects") objects: GraphQLObjects;
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
                    }
                ]
            },
            {
                name: "Content",
                items: Object.entries(this.objects)
                    .filter(([_, field]) => field.type instanceof GraphQLList)
                    .map(([name, _field]) => ({
                        name: pascalCase(name), url: `/${name}`, children: [], exact: false
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
