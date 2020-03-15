import { GrapheneType } from "./types/base";
import { GraphQLOutputType, GraphQLField } from "graphql";
import { GrapheneField } from "./field";
import { Graphene } from "./index";
import { GrapheneInputObjectType } from "./types/inputObject";
import { pascalCase } from "change-case";
import { GrapheneObjectType } from "./types/object";
import { GrapheneListType } from "./types/list";

export class GrapheneQueryField<T extends GrapheneType<GraphQLOutputType> = GrapheneType<GraphQLOutputType>> extends GrapheneField<T>
{
    graphene: Graphene;
    editMutation?: GrapheneField<GrapheneInputObjectType>;
    createMutation?: GrapheneField<GrapheneInputObjectType>;
    deleteMutation?: GrapheneField<GrapheneInputObjectType>;

    static async create<T extends GrapheneField>(name: string, _field: GraphQLField<any, any>, graphene: Graphene): Promise<T>
    {
        const result = await super.create<GrapheneQueryField>(name, _field, graphene, new GrapheneQueryField(name, _field, graphene) as any);
        result.graphene = graphene;

        const objectName = pascalCase(result.asObject().name);
        result.editMutation = result.graphene.getMutation("edit"+objectName);
        result.createMutation = result.graphene.getMutation("create"+objectName);
        result.deleteMutation = result.graphene.getMutation("delete"+objectName);

        return result as any;
    }

    async request<T = any>(args?: Record<string, string|number>)
    {
        const fields = this.type.getType(GrapheneObjectType)?.fieldMap;
        const argStr = args && fields && Object.entries(args).length > 0 ? `(${Object.entries(args).map(([k, v]) => 
        {
            const field = fields[k];

            const quoted = typeof v === "string" || field.name === "String"
            return  `${k}: ` + (quoted ? `"${v}"` : v);
        }).join(", ")})` : "";
        
        const query = `{
            ${this.name}${argStr} ${this.type.toQuery()}
        }`;
        
        return this.graphene.api.client.request<T>(query);
    }

    asList(): GrapheneQueryField<GrapheneListType>
    {
        const list = this.graphene.queryFieldMap[this.name + "s"];
        if (list) return list as any;
        return this as any;
    }

    asObject(): GrapheneQueryField<GrapheneObjectType>
    {
        if (!this.name.endsWith("s")) return this as any;
        const obj = this.graphene.queryFieldMap[this.name.slice(0, this.name.length - 1)];
        if (obj) return obj as any;
        return this as any;
    }

    async edit<R = T>(data: any)
    {
        if (!this.editMutation) return;

        const args = this.editMutation.args;
        console.log("edit args", args);
        const arg = args.find(arg => arg.type.getType(GrapheneInputObjectType));
        const dataType = arg.type.getType(GrapheneInputObjectType);

        const query = `mutation {
            ${this.editMutation.name}(${arg.name}: ${dataType.toArgument(data)}) ${this.type.toQuery()}
        }`;
        
        console.log(query);
        return this.graphene.api.client.request<R>(query);
    }

    async create(data: any)
    {
        if (!this.createMutation) return;

        const args = this.createMutation.args;
        console.log("create args", args);
        const arg = args.find(arg => arg.type.getType(GrapheneInputObjectType));
        const dataType = arg.type.getType(GrapheneInputObjectType);

        const query = `mutation {
            ${this.createMutation.name}(${arg.name}: ${dataType.toArgument(data)}) ${this.type.toQuery()}
        }`;
        
        console.log(query);
        return this.graphene.api.client.request<T>(query);
    }

    async delete<R = T>(id: string|number)
    {
        if (!this.deleteMutation) return;

        const args = this.deleteMutation.args;
        console.log("delete args", args);

        const query = `mutation {
            ${this.deleteMutation.name}(id: "${id}") ${this.type.toQuery().replace("id", "")}
        }`;
        
        console.log(query);
        return this.graphene.api.client.request<R>(query);
    }

    //TODO: Delete
}
