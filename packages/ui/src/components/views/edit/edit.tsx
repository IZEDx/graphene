import { Component, h, Prop, Event, EventEmitter, Watch } from "@stencil/core";
import { MatchResults } from "@stencil/router";
import { graphene, GraphQLObjects } from "../../../global/context";
import { GraphQLSchema } from "graphql";
import { pascalCase } from "change-case";
import { GrapheneAPI } from "../../../global/api";

@Component({
    tag: 'view-edit',
    //styleUrl: 'view-edit.scss',
})
export class EditView 
{
    @Event() pushBreadcrumb: EventEmitter<[string, string]>;
    @Event() clearBreadcrumb: EventEmitter<void>;

    @Prop() match: MatchResults;

    @graphene.Context("api") api: GrapheneAPI;
    @graphene.Context("schema") schema: GraphQLSchema;
    @graphene.Context("objects") objects: GraphQLObjects;

    get name()
    {
        return this.match.params["name"];
    }

    get id()
    {
        return this.match.params["id"];
    }

    @Watch("match")
    async componentWillLoad(newMatch?: MatchResults, oldMatch?: MatchResults)
    {
        if (newMatch && oldMatch && newMatch.url !== oldMatch.url) this.clearBreadcrumb.emit();
        this.pushBreadcrumb.emit([this.name, this.match.url]);
        this.pushBreadcrumb.emit([this.id, this.match.url]);
    }

    render()
    {

        return <segment class="segment">
            <div class="container">
                <div class="content">
                    <h1>{pascalCase(this.name)} / {this.id}</h1>
                </div>
            </div>
        </segment>;
    }
}